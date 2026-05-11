"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!acceptedTerms) {
      setError("Please agree to the Terms of Service to create an account.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName.trim(),
        },
      },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (data.user && data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }
    setMessage(
      "Check your email to confirm your account, then sign in here.",
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create account
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Your display name is shown to people with similar interests.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Display name
            <input
              name="displayName"
              type="text"
              autoComplete="nickname"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            />
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <input
              name="acceptedTerms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (e.target.checked) {
                  setError(null);
                }
              }}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-900 dark:focus:ring-zinc-500"
            />
            <span>
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-zinc-900 underline decoration-zinc-400/60 underline-offset-2 dark:text-zinc-100"
              >
                Terms of Service
              </Link>
              .
            </span>
          </label>
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              {message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className="mt-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
