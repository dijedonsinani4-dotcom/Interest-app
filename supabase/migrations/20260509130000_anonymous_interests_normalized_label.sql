-- If you created anonymous_interests from an older Phase 6 snippet without
-- normalized_label, add it so POST /api/anonymous-interests can insert both fields.
-- Safe to run if the column already exists (Phase 1 schema).

alter table public.anonymous_interests
  add column if not exists normalized_label text;

update public.anonymous_interests
set normalized_label = lower(trim(label))
where normalized_label is null;

alter table public.anonymous_interests
  alter column normalized_label set not null;
