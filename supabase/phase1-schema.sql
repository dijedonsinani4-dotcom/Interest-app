-- Phase 1 — Run once in Supabase: SQL Editor → New query → paste → Run
-- Dashboard: https://supabase.com/dashboard → your project → SQL Editor

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  normalized_label text not null,
  created_at timestamptz not null default now(),
  unique (user_id, normalized_label)
);

create index if not exists interests_user_id_idx on public.interests (user_id);
create index if not exists interests_normalized_label_idx on public.interests (normalized_label);

create table if not exists public.anonymous_interests (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  normalized_label text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Profile row when a new auth user is created
--    Signup must send: options: { data: { display_name: "..." } }
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'display_name'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 3. Similar users (secure aggregate — client never reads others’ interest rows)
-- ---------------------------------------------------------------------------

create or replace function public.get_similar_users(max_results int default 20)
returns table (
  user_id uuid,
  display_name text,
  shared_count bigint,
  shared_labels text[]
)
language sql
stable
security definer
set search_path = public
as $$
  with mine as (
    select normalized_label
    from public.interests
    where interests.user_id = auth.uid()
  ),
  others as (
    select i.user_id, i.normalized_label
    from public.interests i
    where i.user_id is distinct from auth.uid()
      and exists (
        select 1 from mine m where m.normalized_label = i.normalized_label
      )
  ),
  agg as (
    select
      o.user_id,
      count(*)::bigint as shared_count,
      array_agg(o.normalized_label order by o.normalized_label) as shared_labels
    from others o
    group by o.user_id
  )
  select a.user_id, p.display_name, a.shared_count, a.shared_labels
  from agg a
  join public.profiles p on p.id = a.user_id
  order by a.shared_count desc, p.display_name asc
  limit least(coalesce(max_results, 20), 100);
$$;

grant execute on function public.get_similar_users(int) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.interests enable row level security;
alter table public.anonymous_interests enable row level security;

-- profiles
drop policy if exists "Profiles select authenticated" on public.profiles;
create policy "Profiles select authenticated"
  on public.profiles for select
  to authenticated
  using (true);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- interests: only your rows (matching goes through get_similar_users)
drop policy if exists "Users select own interests" on public.interests;
create policy "Users select own interests"
  on public.interests for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users insert own interests" on public.interests;
create policy "Users insert own interests"
  on public.interests for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users update own interests" on public.interests;
create policy "Users update own interests"
  on public.interests for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own interests" on public.interests;
create policy "Users delete own interests"
  on public.interests for delete
  to authenticated
  using (auth.uid() = user_id);

-- anonymous_interests: no client policies — insert from Next.js with service role only
-- (service role bypasses RLS)
