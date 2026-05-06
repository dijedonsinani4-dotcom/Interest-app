# Interest app

Next.js app with Supabase Auth: sign up, add interests, see people with overlapping tags, and browse member profiles with privacy-conscious RPCs.

## Run locally

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase **Project URL** and **anon** key (not the `service_role` key). Apply SQL from `supabase/migrations/` in order (Phase 4, then Phase 5) in the Supabase SQL editor.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (e.g. Vercel)

1. Create a production Supabase project (or use the same one) and run the same migrations.
2. In Supabase: **Authentication → URL configuration** — set **Site URL** to your deployed origin (e.g. `https://your-app.vercel.app`) and add **Redirect URLs** including `https://your-app.vercel.app/auth/callback`.
3. In Vercel (or your host): set env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to match production.
4. Deploy the repo; smoke-test sign-up, login, dashboard matching, and `/settings`.

## Stack

- Next.js (App Router), React, Tailwind CSS  
- Supabase Auth + Postgres (RLS, `add_user_interest`, `get_similar_users`, `get_profile_for_viewer`)
