import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProfileAvatar } from "@/components/profile-avatar";
import { MemberGlassSection, MemberPageShell } from "@/components/member-page-shell";
import { getProfileForViewer } from "@/lib/profile-view";
import { createClient } from "@/lib/supabase/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PublicProfilePage({ params }: Props) {
  const { id } = await params;
  if (!UUID_RE.test(id)) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/u/${id}`)}`);
  }

  const profile = await getProfileForViewer(supabase, id);
  if (!profile) {
    notFound();
  }

  const heading = profile.display_name;
  const sub = profile.is_self
    ? "Your profile"
    : `${profile.interest_names.length} shared interest${profile.interest_names.length === 1 ? "" : "s"}`;

  const kicker = profile.is_self ? "You" : "Member";
  const glassTone = profile.is_self ? "emerald" : "violet";
  const sectionTitle = profile.is_self ? "Your interests" : "Shared interests";
  const sectionDescription = profile.is_self
    ? "Everything shown here is what you’ve added on your dashboard."
    : "Interests you both hold in common — nothing else is revealed.";

  return (
    <MemberPageShell>
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <ProfileAvatar
          displayName={heading}
          avatarUrl={profile.avatar_url}
          size={112}
          className="shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-violet-600/90 dark:text-violet-400/90">
            {kicker}
          </p>
          <h1 className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-[1.65rem] font-semibold tracking-tight text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 sm:text-[1.85rem]">
            {heading}
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{sub}</p>
          {profile.is_self ? (
            <Link
              href="/settings"
              className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-violet-500/35 bg-violet-500/5 px-4 py-2 text-sm font-medium text-violet-800 transition hover:border-violet-400/55 hover:bg-violet-500/10 dark:border-violet-400/35 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:border-violet-300/45 dark:hover:bg-violet-500/15"
            >
              <span>Edit settings</span>
              <span className="transition group-hover:translate-x-0.5" aria-hidden>
                →
              </span>
            </Link>
          ) : null}
        </div>
      </header>

      <MemberGlassSection
        tone={glassTone}
        withTopRule={false}
        icon={
          <span className="text-base" aria-hidden>
            {profile.is_self ? "◇" : "⚬"}
          </span>
        }
        title={sectionTitle}
        description={sectionDescription}
      >
        {profile.interest_names.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 px-4 py-10 text-center text-sm leading-relaxed text-zinc-600 dark:border-white/[0.1] dark:bg-zinc-900/35 dark:text-zinc-400">
            {profile.is_self
              ? "Add interests from your dashboard to fill this grid."
              : "No overlap yet — add matching tags on your dashboard to connect here."}
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2.5">
            {profile.interest_names.map((name) => (
              <li key={name}>
                <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3.5 py-1.5 text-sm font-medium text-zinc-800 ring-1 ring-emerald-500/10 backdrop-blur-sm dark:border-emerald-400/22 dark:bg-emerald-500/10 dark:text-emerald-100/95 dark:ring-emerald-400/12">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </MemberGlassSection>
    </MemberPageShell>
  );
}
