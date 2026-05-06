type Tone = "emerald" | "violet";

/** Shared violet / emerald aura behind member & marketing shells. */
export function AppAmbienceLayers() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-zinc-100 via-white to-zinc-100 dark:from-zinc-950 dark:via-[#09090f] dark:to-zinc-950"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[10%] -z-10 h-72 w-72 rounded-full bg-violet-400/25 blur-[100px] dark:bg-violet-600/18"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-48 -left-20 -z-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-[90px] dark:bg-emerald-500/14"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-56 w-[min(100%,44rem)] -translate-x-1/2 rounded-t-[100%] bg-fuchsia-500/10 blur-3xl dark:bg-fuchsia-600/08"
      />
    </>
  );
}

export function MemberPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex flex-1 flex-col overflow-hidden">
      <AppAmbienceLayers />

      <div className="relative mx-auto flex w-full max-w-xl flex-1 flex-col gap-10 px-4 py-10 sm:gap-11 sm:py-14">
        {children}
      </div>
    </div>
  );
}

export function MemberGlassSection({
  tone,
  icon,
  title,
  description,
  children,
  /** When false, omit the divider above body (dashboard “overlap matches” card). Default true. */
  withTopRule = true,
}: {
  tone: Tone;
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  withTopRule?: boolean;
}) {
  const sectionOuter =
    tone === "emerald"
      ? "relative overflow-hidden rounded-[1.35rem] border border-white/70 bg-white/75 p-[1px] shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset,0_20px_50px_-20px_rgb(0_0_0/0.08)] backdrop-blur-md dark:border-white/[0.08] dark:bg-zinc-950/55 dark:shadow-[0_1px_0_0_rgb(255_255_255/0.06)_inset,0_28px_64px_-24px_rgb(0_0_0/0.65)]"
      : "relative overflow-hidden rounded-[1.35rem] border border-white/70 bg-white/75 p-[1px] shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset,0_20px_50px_-20px_rgb(0_0_0/0.08)] backdrop-blur-md dark:border-violet-500/[0.12] dark:bg-zinc-950/55 dark:shadow-[0_1px_0_0_rgb(139_92_246/0.08)_inset,0_28px_64px_-24px_rgb(0_0_0/0.7)]";

  const innerPanel =
    tone === "emerald"
      ? "rounded-[1.28rem] bg-gradient-to-br from-white via-white to-zinc-50/90 p-6 dark:from-zinc-900/80 dark:via-zinc-900/65 dark:to-zinc-950/90 sm:p-7"
      : "rounded-[1.28rem] bg-gradient-to-br from-white via-zinc-50/50 to-white p-6 dark:from-[#14141c] dark:via-zinc-900/55 dark:to-zinc-950/95 sm:p-7";

  const iconRing =
    tone === "emerald"
      ? "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-violet-500/20 ring-1 ring-emerald-500/20 dark:from-emerald-400/15 dark:to-violet-400/15 dark:ring-emerald-400/20"
      : "mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/20 ring-1 ring-violet-500/25 dark:from-violet-400/20 dark:to-fuchsia-400/15 dark:ring-violet-400/25";

  return (
    <section className={sectionOuter}>
      <div className={innerPanel}>
        <div className="flex items-start gap-3">
          <span className={iconRing}>{icon}</span>
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        <div
          className={
            withTopRule
              ? "mt-7 border-t border-zinc-200/80 pt-6 dark:border-white/[0.07]"
              : "mt-6"
          }
        >
          {children}
        </div>
      </div>
    </section>
  );
}
