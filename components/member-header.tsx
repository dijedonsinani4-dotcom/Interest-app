import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

export async function MemberHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200/90 bg-white/90 backdrop-blur-md dark:border-zinc-800/90 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <div className="flex min-w-0 items-center gap-5 sm:gap-6">
          <Link
            href="/dashboard"
            className="shrink-0 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Interest app
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-zinc-600 sm:flex dark:text-zinc-400">
            <Link
              href="/dashboard"
              className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Dashboard
            </Link>
            <Link
              href="/settings"
              className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Settings
            </Link>
            {user ? (
              <Link
                href={`/u/${user.id}`}
                className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Profile
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Home
          </Link>
          {user ? <SignOutButton /> : null}
        </div>
      </div>
    </header>
  );
}
