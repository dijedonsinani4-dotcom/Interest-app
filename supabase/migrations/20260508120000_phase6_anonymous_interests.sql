-- Phase 6: store free-text interest submissions from unauthenticated callers.
-- Inserts happen only via Next.js Route Handler using SUPABASE_SERVICE_ROLE_KEY
-- (service role bypasses RLS). There are no anon/authenticated policies on this table.

create table public.anonymous_interests (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  normalized_label text not null,
  created_at timestamptz not null default now(),
  constraint anonymous_interests_label_length
    check (char_length(label) >= 1 and char_length(label) <= 60),
  constraint anonymous_interests_normalized_length
    check (
      char_length(normalized_label) >= 1
      and char_length(normalized_label) <= 60
    )
);

create index anonymous_interests_created_at_idx on public.anonymous_interests (created_at desc);

alter table public.anonymous_interests enable row level security;
