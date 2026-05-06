"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    <div className="flex flex-col gap-4">
      <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block flex-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Add an interest
          <input
            type="text"
            name="interest"
            maxLength={60}
            autoComplete="off"
            placeholder="e.g. photography, chess, jazz"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !label.trim()}
          className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Adding…" : "Add"}
        </button>
      </form>

      {error ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}

      {initialInterests.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No interests yet. Add a few to find people who share them.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {initialInterests.map((item) => (
            <li key={item.interest_id}>
              <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                {item.name}
                <button
                  type="button"
                  onClick={() => removeInterest(item.interest_id)}
                  disabled={removing === item.interest_id}
                  className="ml-1 rounded-full p-0.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
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
