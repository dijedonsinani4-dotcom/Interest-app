import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function MarketingHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-10 border-b border-white/60 bg-white/75 backdrop-blur-xl dark:border-white/[0.08] dark:bg-zinc-950/75">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="shrink-0 bg-gradient-to-r from-zinc-900 to-zinc-700 bg-clip-text text-sm font-semibold tracking-tight text-transparent dark:from-zinc-100 dark:to-zinc-300"
        >
          Interest app
        </Link>
        <nav className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/terms"
            className="rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-500 transition hover:bg-violet-500/10 hover:text-violet-800 dark:text-zinc-500 dark:hover:text-violet-200"
          >
            Terms
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-violet-500/10 hover:text-violet-800 dark:text-zinc-400 dark:hover:text-violet-200"
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="hidden rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-violet-500/10 hover:text-violet-800 sm:inline dark:text-zinc-400 dark:hover:text-violet-200"
              >
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-violet-500/10 hover:text-violet-800 dark:text-zinc-400 dark:hover:text-violet-200"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.98] dark:from-violet-500 dark:to-fuchsia-500"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
