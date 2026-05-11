# Interest app

Next.js app with Supabase Auth: sign up, add interests, see people with overlapping tags, and browse member profiles with privacy-conscious RPCs.

## Run locally

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`: **Project URL**, **anon** key, and **`SUPABASE_SERVICE_ROLE_KEY`** (server-only — required for `/api/anonymous-interests`). Apply SQL from `supabase/migrations/` in order — Phase 4, 5, 6 (`20260508120000…`), then if your `anonymous_interests` table lacks `normalized_label`, run `20260509130000_anonymous_interests_normalized_label.sql`, then **`20260510120000_profile_avatar_storage.sql`** (adds `profiles.avatar_url`, public `avatars` storage bucket, and extends `get_profile_for_viewer`) — in the Supabase SQL editor.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (e.g. Vercel)

1. Create a production Supabase project (or use the same one) and run the same migrations.
2. In Supabase: **Authentication → URL configuration** — set **Site URL** to your deployed origin (e.g. `https://your-app.vercel.app`) and add **Redirect URLs** including `https://your-app.vercel.app/auth/callback`.
3. In Vercel (or your host): set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and **`SUPABASE_SERVICE_ROLE_KEY`** (mark as sensitive; not exposed to the browser).
4. Deploy the repo; smoke-test sign-up, login, dashboard matching, `/settings` (display name + profile photo upload), member profiles, and `POST /api/anonymous-interests` with JSON `{"label":"photography"}`.

## Anonymous interest API

`POST /api/anonymous-interests`

- Body: `{ "label": "…" }` or `{ "interest": "…" }` (trimmed length 1–60; same constraint as logged-in interests).
- Response: `201` with `{ "id": "<uuid>" }`; `400` for bad input; `503` if service role env is missing.

## Stack

- Next.js (App Router), React, Tailwind CSS  
- Supabase Auth + Postgres (RLS, `add_user_interest`, `get_similar_users`, `get_profile_for_viewer`)
