import type { SupabaseClient } from "@supabase/supabase-js";

export type SimilarUser = {
  user_id: string;
  overlap_count: number;
  display_name: string;
};

export async function getSimilarUsers(
  supabase: SupabaseClient,
  limit = 20,
): Promise<SimilarUser[]> {
  const { data, error } = await supabase.rpc("get_similar_users", {
    p_limit: limit,
  });
  if (error) {
    console.error("get_similar_users", error);
    return [];
  }
  const rows = (data ?? []) as {
    user_id: string;
    overlap_count: number | string;
    display_name: string;
  }[];
  return rows.map((r) => ({
    user_id: r.user_id,
    overlap_count: Number(r.overlap_count),
    display_name: r.display_name?.trim() || "Member",
  }));
}
