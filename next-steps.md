# Interest app — next steps

This file mirrors the structure of `the-project.md` for context, then lists concrete ideas for future work.

---

## What it does (recap)

People **sign in**, **tag interests**, see **others ranked by overlap**, and open **profiles that only show mutual interests**. Separately, **anonymous visitors** can **POST one suggestion** into **`anonymous_interests`** via a **server-only** route (service role). That feed does not automatically merge into matching unless you build that.

---

## What we built it with (recap)

**Next.js (App Router)** for pages and API routes, **React** for forms and lists, **Supabase** for auth + Postgres + RLS, **Tailwind** for the dark glass look, typical **Vercel** deploy story and env vars (`NEXT_PUBLIC_*` + `SUPABASE_SERVICE_ROLE_KEY` on the server only).

---

## How data flows (recap)

**Session** → server knows `user.id`. **Interests** live in **`interests`** + **`user_interests`**; **add** goes through **`add_user_interest`** (RPC). **Similar users** via **`get_similar_users`**; **profile** via **`get_profile_for_viewer`** (full list for self, intersection for others). **Anonymous** → **`POST /api/anonymous-interests`** → **`anonymous_interests`**.

---

## Front end (recap)

**Marketing** home + auth pages; **member** dashboard, settings, `/u/[id]`; shared **ambience + glass** (`AppAmbienceLayers`, member shell). Business logic stayed server + RPC first; UI focused on polish.

---

## Migrations / phases (recap)

**Phase 4** — catalog + links + add RPC. **Phase 5** — privacy + similar + profile RPCs. **Phase 6** — anonymous table (+ **`normalized_label`** follow-up if needed). See `README.md` for run order.

---

## Ideas for next steps

Grounded in what exists today: **privacy-preserving RPCs**, **anonymous bucket**, **no automated tests yet**, **no rate limits** on anonymous POST.

1. **Hardening anonymous API** — Rate limiting (IP + optional honeypot), max body size, logging/monitoring, CAPTCHA only if abuse appears.

2. **Use or merge anonymous suggestions** — Admin review queue, “promote to catalog” flow, or a periodic job that dedupes into `interests` with moderation flags (keeps the RLS story clean).

3. **Quality of matching** — Weight rare interests higher, cap list size, or “primary” vs secondary interests; may need small schema + RPC changes.

4. **Social / discovery layer** — Optional connection requests, bookmarks, or “hide me from discovery” in settings (RPCs respect flags).

5. **Profiles** — Avatar upload (Supabase Storage), short bio visible only when mutual interests exist, or clearer separation of display name vs email.

6. **Notifications** — Email or in-app when overlap crosses a threshold (needs careful privacy copy).

7. **Tests and CI** — Unit tests for API validation, integration tests against a Supabase test project or mocked client, `npm run lint` + build in CI.

8. **Observability** — Structured logs on API routes, error reporting (e.g. Sentry), simple funnel analytics: signup → first interest → first profile view.

9. **Onboarding** — Guided first run: suggest popular interests, curated picks from anonymous suggestions, strong empty states on the dashboard.

10. **Product polish** — Loading/skeleton states, optimistic UI on add/remove interest, accessibility pass, mobile layout tweaks.

11. **Security review** — RLS policy audit, confirm service role never reaches the client, document what each RPC returns and why.

12. **Documentation** — OpenAPI or short `docs/api.md` for anonymous POST; architecture diagram for interviews or handoff.

---

## Choosing a short backlog

If the goal is **portfolio**, **course**, **real users**, or **learning a specific area**, pick 3–5 items from the list above and order them by impact vs effort.
