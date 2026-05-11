"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const DUMMY_PREVIEW_COUNT = 5;
const DUMMY_PREVIEW_MIN_CHARS = 2;

/** Placeholder names only — never written to the database. Pool must stay larger than `DUMMY_PREVIEW_COUNT`. */
const DUMMY_NAME_POOL = [
  "Alex Rivera",
  "Jordan Kim",
  "Sam Okonkwo",
  "Riley Chen",
  "Morgan Blake",
  "Casey Mbatha",
  "Taylor Nguyen",
  "Jamie Okafor",
  "Quinn Patel",
  "Avery Santos",
  "Rowan Kovács",
  "Drew Matsumoto",
  "Reese Adeyemi",
  "Hayden Popescu",
  "Blake Al-Farsi",
] as const;

function pickDummyNamesForInterestSeed(seed: string, count: number): string[] {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const start = Math.abs(h) % DUMMY_NAME_POOL.length;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(DUMMY_NAME_POOL[(start + i) % DUMMY_NAME_POOL.length]!);
  }
  return out;
}

export type InterestItem = {
  interest_id: string;
  name: string;
};

type Props = {
  userId: string;
  initialInterests: InterestItem[];
};

export function InterestsSection({ userId, initialInterests }: Props) {
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const trimmedLabel = label.trim();
  const dummyPreviewNames = useMemo(() => {
    if (trimmedLabel.length < DUMMY_PREVIEW_MIN_CHARS) {
      return [];
    }
    return pickDummyNamesForInterestSeed(
      trimmedLabel.toLowerCase(),
      DUMMY_PREVIEW_COUNT,
    );
  }, [trimmedLabel]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = label.trim();
    if (!trimmed) {
      return;
    }
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("add_user_interest", {
      p_label: trimmed,
    });
    setLoading(false);
    if (rpcError) {
      setError(rpcError.message);
      return;
    }
    setLabel("");
    router.refresh();
  }

  async function removeInterest(interestId: string) {
    setError(null);
    setRemoving(interestId);
    const supabase = createClient();
    const { error: delError } = await supabase
      .from("user_interests")
      .delete()
      .eq("user_id", userId)
      .eq("interest_id", interestId);
    setRemoving(null);
    if (delError) {
      setError(delError.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleAdd}
        className="flex flex-col gap-3 rounded-2xl border border-zinc-200/90 bg-white/70 p-4 dark:border-white/[0.08] dark:bg-zinc-950/35 sm:flex-row sm:items-end sm:gap-3 sm:p-4"
      >
        <label className="block min-w-0 flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-600/90 dark:text-emerald-400/90">
            New tag
          </span>
          <input
            type="text"
            name="interest"
            maxLength={60}
            autoComplete="off"
            placeholder="photography · chess · jazz…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-300/90 bg-white px-3.5 py-2.5 text-zinc-900 placeholder:text-zinc-400 outline-none ring-2 ring-transparent transition focus:border-emerald-500/50 focus:ring-emerald-500/20 dark:border-white/[0.12] dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400/40 dark:focus:ring-emerald-400/15"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !label.trim()}
          className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.98] disabled:opacity-45 disabled:hover:brightness-100 dark:from-violet-500 dark:to-fuchsia-500 dark:shadow-fuchsia-500/15"
        >
          {loading ? "Saving…" : "Add"}
        </button>
      </form>

      {dummyPreviewNames.length === DUMMY_PREVIEW_COUNT ? (
        <div
          className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3.5 dark:border-amber-400/20 dark:bg-amber-500/[0.07]"
          aria-hidden
        >
          <ul className="flex flex-col gap-2">
            {dummyPreviewNames.map((name) => (
              <li
                key={name}
                className="flex items-center gap-2 rounded-lg border border-zinc-200/80 bg-white/60 px-3 py-2 text-sm font-medium text-zinc-800 dark:border-white/[0.08] dark:bg-zinc-900/40 dark:text-zinc-200"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200/80 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  aria-hidden
                >
                  {name
                    .split(/\s+/)
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {error ? (
        <p
          className="rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2 text-sm text-red-700 dark:text-red-300"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {initialInterests.length === 0 ? (
        <p className="rounded-xl bg-zinc-100/70 px-3 py-3 text-center text-sm text-zinc-600 dark:bg-white/[0.04] dark:text-zinc-500">
          No tags yet — drop one in above to seed your taste graph.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2.5">
          {initialInterests.map((item) => (
            <li key={item.interest_id}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08] px-3.5 py-1.5 text-sm font-medium text-zinc-800 ring-1 ring-emerald-500/10 backdrop-blur-sm dark:border-emerald-400/22 dark:bg-emerald-500/10 dark:text-emerald-100/95 dark:ring-emerald-400/12">
                {item.name}
                <button
                  type="button"
                  onClick={() => removeInterest(item.interest_id)}
                  disabled={removing === item.interest_id}
                  className="-mr-1 rounded-full p-1 text-zinc-500 transition hover:bg-emerald-500/20 hover:text-zinc-900 disabled:opacity-50 dark:text-emerald-200/55 dark:hover:bg-emerald-500/25 dark:hover:text-white"
                  aria-label={`Remove ${item.name}`}
                >
                  ×
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
