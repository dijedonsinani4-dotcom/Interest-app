-- Phase 4: interests + user_interests (run in Supabase SQL Editor or via CLI)
--
-- If you see "column name does not exist", you already had a public.interests table
-- with a different shape. The drops below remove Phase 4 tables so this script can
-- recreate them. WARNING: deletes all rows in those tables.

drop table if exists public.user_interests cascade;
drop table if exists public.interests cascade;

-- 1) Tables
create table public.interests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  constraint interests_name_length check (char_length(name) >= 1 and char_length(name) <= 60)
);

create unique index interests_name_lower_uniq
  on public.interests ((lower(trim(name))));

create table public.user_interests (
  user_id uuid not null references auth.users (id) on delete cascade,
  interest_id uuid not null references public.interests (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, interest_id)
);

create index if not exists user_interests_interest_id_idx on public.user_interests (interest_id);

-- 2) RLS
alter table public.interests enable row level security;
alter table public.user_interests enable row level security;

-- Anyone signed in can read the catalog (for display / matching).
create policy "interests_select_authenticated"
  on public.interests for select
  to authenticated
  using (true);

-- Inserts into interests go through add_user_interest (security definer) only.

-- Matching requires reading other users' rows (MVP).
create policy "user_interests_select_authenticated"
  on public.user_interests for select
  to authenticated
  using (true);

create policy "user_interests_insert_own"
  on public.user_interests for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "user_interests_delete_own"
  on public.user_interests for delete
  to authenticated
  using (auth.uid() = user_id);

-- 3) RPC: add interest by label (dedupe by case-insensitive name)
create or replace function public.add_user_interest(p_label text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  t text := trim(p_label);
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if length(t) < 1 or length(t) > 60 then
    raise exception 'invalid interest length' using errcode = '22023';
  end if;

  insert into public.interests (name) values (t)
  on conflict ((lower(trim(name)))) do nothing;

  select id into v_id from public.interests
  where lower(trim(name)) = lower(trim(t));

  if v_id is null then
    raise exception 'interest not found after insert' using errcode = 'P0001';
  end if;

  insert into public.user_interests (user_id, interest_id)
  values (auth.uid(), v_id)
  on conflict (user_id, interest_id) do nothing;
end;
$$;

revoke all on function public.add_user_interest(text) from public;
grant execute on function public.add_user_interest(text) to authenticated;
