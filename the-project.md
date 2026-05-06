# The project — plain-language overview

This document explains what **Interest app** is, how the pieces fit together, and how you can describe it to someone else (for example in an interview or a README).

---

## What it does (the idea)

Interest app lets people:

1. **Create an account and sign in** (email + password via Supabase).
2. **Add personal “interests”** — short labels like “photography” or “chess”.
3. **See other members ranked by overlap** — how many interests they share with you.
4. **Open profiles** — you see names and **only interests you share** with that person (not their full private list).

There is also a **server API** (`POST`) so **anonymous** visitors can submit a single interest suggestion into a dedicated table (`anonymous_interests`). That feed is stored for later ideas (it does **not** automatically merge into logged-in matching unless you build that separately).

---

## What we built it with

| Piece | Role |
|--------|------|
| **Next.js** (App Router) | Web UI and API routes; pages like `/`, `/login`, `/dashboard`, `/settings`, `/u/[id]`. |
| **React** | Interactive bits (forms, adding/removing interests). |
| **Supabase** | **Postgres** database, **Row Level Security (RLS)**, and **Auth** (who is signed in). |
| **Tailwind CSS** | Styling (including the dark “glass” look on dashboard, settings, profile, and marketing home). |
| **Vercel** (typical) | Hosting; you set the same env vars there as locally. |

---

## How data flows (simple picture)

1. **Sign up / sign in** → Supabase creates a session (cookies in the browser). Next.js server components can read that session and know `user.id`.

2. **Interests** live in two main tables (after the Phase 4-style setup):
   - **`interests`** — a **catalog** of unique interest names (deduped by normalized text).
   - **`user_interests`** — **links** a user to rows in `interests` (many-to-many).

3. **Adding an interest** from the dashboard does **not** require the client to manually insert into both tables. The app calls a **Postgres function (RPC)** like `add_user_interest` with a label; that function runs with elevated rights (**security definer**) and safely inserts/links.

4. **Similar users** are **not** computed by downloading everyone’s links in the browser. The app calls another RPC, **`get_similar_users`**, which counts overlapping `interest_id` values and returns other user ids + overlap counts + display names. Tighter RLS can hide raw `user_interests` rows from other users while still allowing this aggregate through the RPC.

5. **Profile view** uses something like **`get_profile_for_viewer`** so the server returns only what the viewer is allowed to see (full list for yourself, **intersection only** for others).

6. **Anonymous submissions** hit **`POST /api/anonymous-interests`** in Next.js. That route uses the **Supabase service role key** only on the server to insert into **`anonymous_interests`**. The **anon** key in the browser never gets that power. The table is meant to accept `label` (and your DB may also require **`normalized_label`** for compatibility with an older schema).

---

## Important environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + server | Your project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server | Safe public key for signed-in user actions under RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** (e.g. Vercel env, `.env.local`) | Used only by the anonymous-interest API route; **never** prefix with `NEXT_PUBLIC_`. |

---

## SQL migrations (what they are for)

Under `supabase/migrations/`, ordered scripts define tables, RLS policies, and RPCs. You run them in Supabase (SQL editor or CLI) so the cloud database matches what the code expects:

- Phase 4 — interests catalog + user links + `add_user_interest`.
- Phase 5 — tighter profile/matching/view rules + `get_similar_users` / `get_profile_for_viewer` style logic.
- Phase 6 (+ follow-up migration if needed) — `anonymous_interests` and aligning columns like `normalized_label` if your project had an older table.

---

## Front end: what changed visually

We did **not** change business logic to “make it pretty.” Updates were mostly **Tailwind layout and visuals**:

- **Member area** (dashboard, settings, profile): shared **`AppAmbienceLayers`** background, **glass** panels, violet/emerald accents, gradient headings and primary buttons.
- **Marketing home + header**: same ambience and glass-style hero plus feature cards so the landing page feels like the same product as the app.

---

## How to explain the project in one minute

You could say:

> “It’s a small social discovery app built with Next.js and Supabase. Users sign up, tag themselves with interests, and the backend uses Postgres functions to find other users with overlapping tags without leaking private data. Profiles only show mutual interests. There’s also a server-only API endpoint that collects anonymous interest suggestions into a separate table using the service role key.”

---

## What could be improved later

- **Rate limiting** on `POST /api/anonymous-interests` to reduce spam.
- **Tests** (there is no automated test suite in the repo yet).
- **Connecting** anonymous submissions to the main catalog (product decision + ETL or moderation).
- **Documentation** for assignment-style writeups (e.g. AI usage notes) if you need to submit that for a course or job task.

---

## Files worth knowing about

| Area | Examples |
|------|-----------|
| Pages | `app/(marketing)/page.tsx`, `app/(member)/dashboard/page.tsx`, `app/(member)/settings/`, `app/(member)/u/[id]/` |
| API | `app/api/anonymous-interests/route.ts` |
| Auth callback | `app/auth/callback/route.ts` |
| Shared look | `components/member-page-shell.tsx` (`AppAmbienceLayers`, `MemberGlassSection`) |
| DB scripts | `supabase/migrations/*.sql` |

This should be enough to **learn the shape of the system** and **talk about it confidently** without needing to memorize every line of code.
