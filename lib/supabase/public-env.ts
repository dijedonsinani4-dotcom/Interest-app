/**
 * Read Supabase URL + anon key with trimmed values so Windows CRLF in `.env.local`
 * does not append `\r` to the JWT and trigger "Invalid API key".
 */
export function getPublicSupabaseConfig(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return { url, anonKey };
}
