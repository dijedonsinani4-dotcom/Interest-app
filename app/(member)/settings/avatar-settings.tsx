"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProfileAvatar } from "@/components/profile-avatar";
import { createClient } from "@/lib/supabase/client";

const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

function storagePathForUser(userId: string): string {
  return `${userId}/avatar`;
}

type Props = {
  displayName: string;
  initialAvatarUrl: string | null;
};

export function AvatarSettings({ displayName, initialAvatarUrl }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialAvatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setPreviewUrl(initialAvatarUrl);
  }, [initialAvatarUrl]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) {
      return;
    }
    setError(null);
    if (!ALLOWED_TYPES.has(file.type)) {
      setError("Use JPEG, PNG, GIF, or WebP.");
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      setError("You are signed out.");
      return;
    }
    const path = storagePathForUser(user.id);
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });
    if (uploadError) {
      setBusy(false);
      setError(uploadError.message);
      return;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = pub.publicUrl;
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);
    setBusy(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setPreviewUrl(publicUrl);
    router.refresh();
  }

  async function handleRemove() {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      setError("You are signed out.");
      return;
    }
    const path = storagePathForUser(user.id);
    await supabase.storage.from("avatars").remove([path]);
    const { error: dbError } = await supabase
      .from("profiles")
      .update({ avatar_url: null })
      .eq("id", user.id);
    setBusy(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setPreviewUrl(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
      <ProfileAvatar
        displayName={displayName || "Member"}
        avatarUrl={previewUrl}
        size={96}
        className="shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          onChange={handleFileChange}
          disabled={busy}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border border-zinc-300/90 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-45 dark:border-white/[0.12] dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            {busy ? "Working…" : "Upload photo"}
          </button>
          {previewUrl ? (
            <button
              type="button"
              disabled={busy}
              onClick={handleRemove}
              className="rounded-xl border border-red-500/35 bg-red-500/5 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-500/10 disabled:opacity-45 dark:text-red-300 dark:hover:bg-red-500/15"
            >
              Remove photo
            </button>
          ) : null}
        </div>
        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          JPEG, PNG, GIF, or WebP · up to 5 MB. Shown on your profile for other
          signed-in members.
        </p>
        {error ? (
          <p
            className="rounded-xl border border-red-500/30 bg-red-500/5 px-3 py-2 text-sm text-red-700 dark:text-red-300"
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
