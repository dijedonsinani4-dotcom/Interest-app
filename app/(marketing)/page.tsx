import Link from "next/link";

const steps = [
  {
    n: "1",
    tone: "emerald" as const,
    title: "Add interests",
    body: "Tag yourself with hobbies or topics — similar spellings roll up into one tag.",
  },
  {
    n: "2",
    tone: "violet" as const,
    title: "See overlap",
    body: "Your dashboard ranks people by shared interests using server-side logic, not scraped lists.",
  },
  {
    n: "3",
    tone: "emerald" as const,
    title: "Open profiles",
    body: "View a member’s name and only the interests you have in common — nothing else leaks.",
  },
];

function FeatureCard(props: {
  tone: "emerald" | "violet";
  step: string;
  title: string;
  body: string;
}) {
  const ring =
    props.tone === "emerald"
      ? "dark:border-white/[0.08] dark:shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset,0_20px_48px_-28px_rgb(0_0_0/0.55)]"
      : "dark:border-violet-500/[0.12] dark:shadow-[0_1px_0_0_rgb(139_92_246/0.08)_inset,0_20px_48px_-28px_rgb(0_0_0/0.6)]";

  const inner =
    props.tone === "emerald"
      ? "dark:from-zinc-900/75 dark:via-zinc-900/60 dark:to-zinc-950/85"
      : "dark:from-[#14141c] dark:via-zinc-900/50 dark:to-zinc-950/90";

  const badge =
    props.tone === "emerald"
      ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-800 ring-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-400/25"
      : "border-violet-400/35 bg-violet-500/10 text-violet-900 ring-violet-500/20 dark:text-violet-100 dark:ring-violet-400/25";

  return (
    <li
      className={`relative overflow-hidden rounded-[1.25rem] border border-white/75 bg-white/80 p-[1px] shadow-[0_20px_50px_-24px_rgb(0_0_0/0.12)] backdrop-blur-md dark:border-white/[0.06] dark:bg-zinc-950/50 ${ring}`}
    >
      <div
        className={`flex h-full flex-col rounded-[1.2rem] bg-gradient-to-br from-white via-white to-zinc-50/90 p-5 sm:p-6 ${inner}`}
      >
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold uppercase tracking-wider ring-1 ${badge}`}
        >
          {props.step}
        </span>
        <p className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {props.title}
        </p>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {props.body}
        </p>
      </div>
    </li>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative px-4 py-16 sm:py-24">
        <div className="relative mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[1.55rem] border border-white/75 bg-white/70 p-[1px] shadow-[0_28px_64px_-28px_rgb(0_0_0/0.2)] backdrop-blur-xl dark:border-violet-500/[0.15] dark:bg-zinc-950/45 dark:shadow-[0_1px_0_0_rgb(139_92_246/0.1)_inset,0_32px_80px_-36px_rgb(0_0_0/0.75)]">
            <div className="rounded-[1.48rem] bg-gradient-to-br from-white via-zinc-50/80 to-white px-8 py-14 dark:from-[#12121a] dark:via-zinc-900/60 dark:to-zinc-950/95 sm:px-12 sm:py-16 lg:py-20">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-violet-600/90 dark:text-violet-400/90">
                Find your people
              </p>
              <h1 className="mt-4 max-w-2xl bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 bg-clip-text text-[2.1rem] font-semibold leading-[1.12] tracking-tight text-transparent sm:text-5xl dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-100">
                Share interests. Meet others who care about the same things.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Add tags that describe you, see who overlaps, and open profiles — without exposing
                your full list to strangers.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:brightness-110 active:scale-[0.98] dark:from-violet-500 dark:to-fuchsia-500"
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white/90 px-7 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/[0.14] dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:bg-zinc-900/95"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 sm:pb-20">
        <p className="text-center font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-violet-600/90 dark:text-violet-400/90">
          How it works
        </p>
        <h2 className="mx-auto mt-2 max-w-lg text-center text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
          Three steps. Same glassy thread as your dashboard.
        </h2>
        <ul className="mt-12 grid gap-6 sm:grid-cols-3 sm:gap-5">
          {steps.map((s) => (
            <FeatureCard
              key={s.n}
              tone={s.tone}
              step={s.n}
              title={s.title}
              body={s.body}
            />
          ))}
        </ul>
      </section>

      <footer className="mt-auto border-t border-white/50 py-8 dark:border-white/[0.06]">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
          Interest app — Next.js, Supabase, and a little overlap magic.
        </p>
      </footer>
    </div>
  );
}
