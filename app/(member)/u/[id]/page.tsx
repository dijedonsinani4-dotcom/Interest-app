import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 py-10 sm:py-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {heading}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{sub}</p>
        {profile.is_self ? (
          <Link
            href="/settings"
            className="mt-3 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Edit profile
          </Link>
        ) : null}
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {profile.is_self ? "Your interests" : "Shared interests"}
        </h2>
        {profile.interest_names.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {profile.is_self
              ? "Add interests from your dashboard."
              : "No overlap yet—add matching tags on your dashboard."}
          </p>
        ) : (
          <ul className="mt-4 flex flex-wrap gap-2">
            {profile.interest_names.map((name) => (
              <li key={name}>
                <span className="inline-block rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                  {name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
