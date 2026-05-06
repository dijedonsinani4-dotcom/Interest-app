-- Phase 5: tighter user_interests visibility + RPCs for matching and profile views.
-- Run in Supabase SQL Editor after Phase 4.

-- 1) Only read your own user_interests rows via PostgREST (matching uses RPC below).
drop policy if exists "user_interests_select_authenticated" on public.user_interests;
drop policy if exists "user_interests_select_own" on public.user_interests;

create policy "user_interests_select_own"
  on public.user_interests for select
  to authenticated
  using (auth.uid() = user_id);

-- 2) Similar users (overlap count + display name). SECURITY DEFINER reads join data; only returns matches for caller.
-- DROP first: Postgres cannot change an existing function's return row type with CREATE OR REPLACE.
drop function if exists public.get_similar_users(integer);
drop function if exists public.get_similar_users(int);

create or replace function public.get_similar_users(p_limit int default 20)
returns table (
  user_id uuid,
  overlap_count bigint,
  display_name text
)
language sql
stable
security definer
set search_path = public
as $$
  with mine as (
    select ui.interest_id
    from public.user_interests ui
    where ui.user_id = auth.uid()
  ),
  scored as (
    select
      o.user_id as other_id,
      count(*)::bigint as cnt
    from public.user_interests o
    where o.interest_id in (select interest_id from mine)
      and o.user_id <> auth.uid()
    group by o.user_id
    order by count(*) desc
    limit coalesce(nullif(p_limit, 0), 20)
  )
  select
    s.other_id,
    s.cnt,
    coalesce(nullif(trim(pr.display_name), ''), 'Member')::text
  from scored s
  left join public.profiles pr on pr.id = s.other_id;
$$;

revoke all on function public.get_similar_users(int) from public;
grant execute on function public.get_similar_users(int) to authenticated;

-- 3) Profile for viewer: full interest list for self; only shared interests for others.
drop function if exists public.get_profile_for_viewer(uuid);

create or replace function public.get_profile_for_viewer(p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.profiles%rowtype;
  v_names text[];
  v_self boolean;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if p_user_id is null then
    raise exception 'invalid user';
  end if;

  select * into v_row
  from public.profiles p
  where p.id = p_user_id;

  if not found then
    return null;
  end if;

  v_self := (auth.uid() = p_user_id);

  if v_self then
    select coalesce(array_agg(i.name order by i.name), '{}')
    into v_names
    from public.user_interests ui
    join public.interests i on i.id = ui.interest_id
    where ui.user_id = p_user_id;
  else
    select coalesce(array_agg(distinct i.name order by i.name), '{}')
    into v_names
    from public.user_interests my
    join public.user_interests their on my.interest_id = their.interest_id
    join public.interests i on i.id = my.interest_id
    where my.user_id = auth.uid() and their.user_id = p_user_id;
  end if;

  return jsonb_build_object(
    'display_name', coalesce(nullif(trim(v_row.display_name), ''), 'Member'),
    'interest_names', to_jsonb(v_names),
    'is_self', v_self
  );
end;
$$;

revoke all on function public.get_profile_for_viewer(uuid) from public;
grant execute on function public.get_profile_for_viewer(uuid) to authenticated;

-- 4) Profiles: only direct select/update of your own row (viewing others goes through RPC).
alter table public.profiles enable row level security;

drop policy if exists "Profiles: read own" on public.profiles;
drop policy if exists "Profiles: update own" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
