import type { SupabaseClient } from "@supabase/supabase-js";

export type ProfileForViewer = {
  display_name: string;
  interest_names: string[];
  is_self: boolean;
};

export async function getProfileForViewer(
  supabase: SupabaseClient,
  profileUserId: string,
): Promise<ProfileForViewer | null> {
  const { data, error } = await supabase.rpc("get_profile_for_viewer", {
    p_user_id: profileUserId,
  });
  if (error) {
    console.error("get_profile_for_viewer", error);
    return null;
  }
  if (data == null) {
    return null;
  }
  const raw = data as {
    display_name?: string;
    interest_names?: string[];
    is_self?: boolean;
  };
  const names = Array.isArray(raw.interest_names) ? raw.interest_names : [];
  return {
    display_name: raw.display_name?.trim() || "Member",
    interest_names: names,
    is_self: Boolean(raw.is_self),
  };
}
