"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  initialDisplayName: string;
};

export function ProfileSettingsForm({ initialDisplayName }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const trimmed = displayName.trim();
    if (trimmed.length < 1) {
      setError("Display name is required.");
      return;
    }
    if (trimmed.length > 80) {
      setError("Display name must be 80 characters or fewer.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("You are signed out.");
      return;
    }
    const { error: upError } = await supabase
      .from("profiles")
      .update({ display_name: trimmed })
      .eq("id", user.id);
    setLoading(false);
    if (upError) {
      setError(upError.message);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-600/90 dark:text-emerald-400/90">
          Display name
        </span>
        <input
          type="text"
          name="displayName"
          autoComplete="nickname"
          required
          maxLength={80}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="mt-2 w-full rounded-xl border border-zinc-300/90 bg-white px-3.5 py-2.5 text-zinc-900 outline-none ring-2 ring-transparent transition focus:border-emerald-500/50 focus:ring-emerald-500/20 dark:border-white/[0.12] dark:bg-zinc-900/80 dark:text-zinc-100 dark:focus:border-emerald-400/40 dark:focus:ring-emerald-400/15"
        />
      </label>
      {error ? (
        <p
          className="rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2 text-sm text-red-700 dark:text-red-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-300">
          Saved.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-45 disabled:hover:brightness-100 dark:from-violet-500 dark:to-fuchsia-500 dark:shadow-fuchsia-500/15"
        >
          {loading ? "Saving…" : "Save"}
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl border border-white/70 bg-white/80 px-5 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white dark:border-white/[0.12] dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900/90"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
