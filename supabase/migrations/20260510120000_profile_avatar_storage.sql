-- Profile avatars: public URL on profiles + Storage bucket + RPC exposes avatar_url.
-- Run in Supabase SQL Editor after prior migrations.

alter table public.profiles
  add column if not exists avatar_url text;

comment on column public.profiles.avatar_url is 'Public URL for profile photo (Supabase Storage /avatars bucket).';

-- Public bucket; objects scoped by first path segment = auth.uid().
-- (Minimal columns only — avoids Supabase version mismatches on file_size_limit / mime types.)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set
  public = excluded.public,
  name = excluded.name;

drop policy if exists "Avatar public read" on storage.objects;
create policy "Avatar public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "Avatar insert own folder" on storage.objects;
create policy "Avatar insert own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatar update own folder" on storage.objects;
create policy "Avatar update own folder"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Avatar delete own folder" on storage.objects;
create policy "Avatar delete own folder"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Profile for viewer: include avatar_url (nullable).
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
  v_avatar text;
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

  v_avatar := nullif(trim(v_row.avatar_url), '');

  return jsonb_build_object(
    'display_name', coalesce(nullif(trim(v_row.display_name), ''), 'Member'),
    'interest_names', to_jsonb(v_names),
    'is_self', v_self,
    'avatar_url', v_avatar
  );
end;
$$;

revoke all on function public.get_profile_for_viewer(uuid) from public;
grant execute on function public.get_profile_for_viewer(uuid) to authenticated;
