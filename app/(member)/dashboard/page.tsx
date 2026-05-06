import Link from "next/link";
import { redirect } from "next/navigation";
import { MemberGlassSection, MemberPageShell } from "@/components/member-page-shell";
import { getSimilarUsers } from "@/lib/similar-users";
import { createClient } from "@/lib/supabase/server";
import { InterestsSection } from "./interests-section";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ?? user.email?.split("@")[0] ?? "there";

  const { data: linkRows } = await supabase
    .from("user_interests")
    .select("interest_id")
    .eq("user_id", user.id);

  const interestIds = linkRows?.map((r) => r.interest_id) ?? [];

  const { data: interestRecords } =
    interestIds.length > 0
      ? await supabase
          .from("interests")
          .select("id, name")
          .in("id", interestIds)
      : { data: [] as { id: string; name: string }[] };

  const initialInterests =
    interestRecords?.map((row) => ({
      interest_id: row.id,
      name: row.name,
    })) ?? [];

  initialInterests.sort((a, b) => a.name.localeCompare(b.name));

  const similarUsers = await getSimilarUsers(supabase);

  return (
    <MemberPageShell>
      <header className="space-y-1">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-violet-600/90 dark:text-violet-400/90">
          Your space
        </p>
        <h1 className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-[1.65rem] font-semibold tracking-tight text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 sm:text-[1.85rem]">
          Hello, {displayName}
        </h1>
        <p className="truncate text-sm text-zinc-500 dark:text-zinc-500">{user.email}</p>
        <Link
          href={`/u/${user.id}`}
          className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/35 bg-violet-500/5 px-4 py-2 text-sm font-medium text-violet-800 transition hover:border-violet-400/55 hover:bg-violet-500/10 dark:border-violet-400/35 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:border-violet-300/45 dark:hover:bg-violet-500/15"
        >
          <span>View profile</span>
          <span className="transition group-hover:translate-x-0.5" aria-hidden>
            →
          </span>
        </Link>
      </header>

      <MemberGlassSection
        tone="emerald"
        icon={
          <span className="text-base" aria-hidden>
            ◇
          </span>
        }
        title="Your interests"
        description='Curate tags you care about — we use them privately to surface people with real overlap, not vague "nearby" guesses.'
      >
        <InterestsSection
          userId={user.id}
          initialInterests={initialInterests}
        />
      </MemberGlassSection>

      <MemberGlassSection
        tone="violet"
        withTopRule={false}
        icon={
          <span className="text-base" aria-hidden>
            ⚬
          </span>
        }
        title="Overlap matches"
        description="Members ranked by shared interest count."
      >
        {similarUsers.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-10 text-center text-sm leading-relaxed text-zinc-600 dark:border-white/[0.1] dark:bg-zinc-900/35 dark:text-zinc-400">
            {initialInterests.length === 0
              ? "Add interests in the panel above — then we’ll look for resonance with other members."
              : "Nobody else overlaps your set yet. Check back once more people join the same threads."}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {similarUsers.map((person) => (
              <li key={person.user_id}>
                <Link
                  href={`/u/${person.user_id}`}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-zinc-200/90 bg-white/90 px-4 py-3.5 shadow-sm transition-[border-color,box-shadow,transform] hover:border-violet-400/55 hover:shadow-[0_0_0_1px_rgb(139_92_246/0.15)] dark:border-white/[0.08] dark:bg-zinc-900/50 dark:hover:border-violet-400/35 dark:hover:bg-zinc-900/85 dark:hover:shadow-[0_0_28px_-8px_rgb(139_92_246/0.35)] active:scale-[0.995]"
                >
                  <span className="truncate font-medium text-zinc-900 dark:text-zinc-100">
                    {person.display_name}
                  </span>
                  <span className="shrink-0 rounded-full bg-gradient-to-r from-violet-500/15 to-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-800 ring-1 ring-violet-500/20 dark:text-violet-200 dark:ring-violet-400/25">
                    {person.overlap_count} overlap
                    <span className="ml-1 inline-block opacity-70 transition group-hover:translate-x-0.5" aria-hidden>
                      ›
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </MemberGlassSection>
    </MemberPageShell>
  );
}
