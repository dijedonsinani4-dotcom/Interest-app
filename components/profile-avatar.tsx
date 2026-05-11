"use client";

import Image from "next/image";

export function initialsFromDisplayName(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  const first = parts[0]![0]!;
  const last = parts[parts.length - 1]![0]!;
  return (first + last).toUpperCase();
}

function textClassForSize(size: number): string {
  if (size <= 40) {
    return "text-xs";
  }
  if (size <= 56) {
    return "text-sm";
  }
  if (size <= 80) {
    return "text-base";
  }
  return "text-xl";
}

type Props = {
  displayName: string;
  avatarUrl: string | null;
  size?: number;
  className?: string;
};

export function ProfileAvatar({
  displayName,
  avatarUrl,
  size = 96,
  className = "",
}: Props) {
  const initials = initialsFromDisplayName(displayName);
  const ring = "shadow-md ring-2 ring-white/60 dark:ring-white/10";
  const textSz = textClassForSize(size);

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={`${displayName}'s profile photo`}
        width={size}
        height={size}
        className={`rounded-full object-cover ${ring} ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/90 to-fuchsia-600/90 font-semibold text-white dark:from-violet-500/80 dark:to-fuchsia-500/80 ${ring} ${textSz} ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
