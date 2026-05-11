import type { NextConfig } from "next";

function supabaseStorageImageHost(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    return "localhost";
  }
  try {
    return new URL(url).hostname;
  } catch {
    return "localhost";
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseStorageImageHost(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
