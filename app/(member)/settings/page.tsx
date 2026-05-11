import Link from "next/link";
import { redirect } from "next/navigation";
import { MemberGlassSection, MemberPageShell } from "@/components/member-page-shell";
import { createClient } from "@/lib/supabase/server";
import { AvatarSettings } from "./avatar-settings";
import { ProfileSettingsForm } from "./profile-settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/settings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.display_name ?? "";
  const avatarUrl =
    typeof profile?.avatar_url === "string" && profile.avatar_url.trim().length > 0
      ? profile.avatar_url.trim()
      : null;

  return (
    <MemberPageShell>
      <header className="space-y-1">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-violet-600/90 dark:text-violet-400/90">
          Account
        </p>
        <h1 className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-[1.65rem] font-semibold tracking-tight text-transparent dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 sm:text-[1.85rem]">
          Profile settings
        </h1>
        <p className="max-w-lg text-sm text-zinc-600 dark:text-zinc-400">
          Update your photo and how your name appears across the member graph and
          profile views.
        </p>
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
        tone="violet"
        withTopRule={false}
        icon={
          <span className="text-base" aria-hidden>
            ◉
          </span>
        }
        title="Profile photo"
        description="Square or wide images work — we crop to a circle on your profile."
      >
        <AvatarSettings displayName={displayName} initialAvatarUrl={avatarUrl} />
      </MemberGlassSection>

      <MemberGlassSection
        tone="emerald"
        withTopRule={false}
        icon={
          <span className="text-base" aria-hidden>
            ◇
          </span>
        }
        title="Public name"
        description="Others see this beside your overlaps and profile card. Short and human works best."
      >
        <ProfileSettingsForm initialDisplayName={displayName} />
      </MemberGlassSection>
    </MemberPageShell>
  );
}
