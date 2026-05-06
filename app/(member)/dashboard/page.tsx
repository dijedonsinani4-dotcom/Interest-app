import Link from "next/link";
import { redirect } from "next/navigation";
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
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 py-10 sm:py-12">
      <header>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Signed in
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Hello, {displayName}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {user.email}
        </p>
        <Link
          href={`/u/${user.id}`}
          className="mt-3 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-100"
        >
          View your profile
        </Link>
      </header>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          Your interests
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Add tags so we can match you with people who share them.
        </p>
        <div className="mt-5">
          <InterestsSection
            userId={user.id}
            initialInterests={initialInterests}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          People with overlapping interests
        </h2>
        {similarUsers.length === 0 ? (
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {initialInterests.length === 0
              ? "Add some interests above to see matches."
              : "No other members share your interests yet."}
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-3">
            {similarUsers.map((person) => (
              <li key={person.user_id}>
                <Link
                  href={`/u/${person.user_id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800/80"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {person.display_name}
                  </span>
                  <span className="shrink-0 rounded-full bg-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    {person.overlap_count} shared
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
