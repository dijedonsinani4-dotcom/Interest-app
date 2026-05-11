import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="relative flex flex-1 flex-col px-4 py-12 sm:py-16">
      <article className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-200/90 bg-white/80 p-8 shadow-sm backdrop-blur-sm dark:border-white/[0.08] dark:bg-zinc-950/55 sm:p-10">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-violet-600/90 dark:text-violet-400/90">
          Legal
        </p>
        <h1 className="mt-2 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-100 sm:text-[1.65rem]">
          Terms of Service
        </h1>
        <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-3.5 py-3 text-sm leading-relaxed text-amber-950 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-100/95">
          <strong className="font-semibold">Template notice.</strong> This text is a
          starting point for a student or personal project, not legal advice. Before
          real users or production use, replace it with terms reviewed by a qualified
          lawyer in your jurisdiction.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <strong className="text-zinc-800 dark:text-zinc-200">Last updated:</strong>{" "}
          May 9, 2026. Interest app (“we”, “us”, “the service”) is a web application
          that helps members discover others based on self-declared interests.
        </p>

        <section className="mt-10 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            1. Acceptance
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            By creating an account or using the service, you agree to these Terms. If
            you do not agree, do not use the service.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            2. Accounts and eligibility
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            You must provide accurate information for registration. You are responsible
            for safeguarding your password and for activity under your account. You
            must not impersonate others or create accounts for abusive purposes.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            3. Acceptable use
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            You agree not to misuse the service: no unlawful activity, harassment,
            spam, attempts to breach security, scraping in violation of our technical
            limits, or interference with other users’ use of the service.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            4. Content you submit
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            You retain rights to content you submit (such as interest labels and
            display names). You grant us a limited license to host, process, and
            display that content as needed to operate features you use — for example
            matching and profile views according to our privacy-aware design.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            5. Privacy
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            How we handle personal data depends on how the project is deployed. Use
            Supabase and hosting providers in line with their documentation and
            applicable law. Other members see only what the product is designed to
            reveal (for example, shared interests when viewing another profile).
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            6. Disclaimers
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            The service is provided “as is” without warranties of any kind. We do not
            guarantee uninterrupted availability, accuracy of matches, or suitability
            for any purpose. You use the service at your own risk.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            7. Limitation of liability
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            To the maximum extent permitted by law, we are not liable for indirect,
            incidental, or consequential damages, or for any loss arising from use of
            the service or interactions with other members.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            8. Changes and termination
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            We may modify these Terms or the service. We may suspend or terminate
            accounts that violate these Terms. You may stop using the service at any
            time.
          </p>
        </section>

        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            9. Contact
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            For questions about these Terms, use the contact method published for your
            deployment (for example a project email or support channel).
          </p>
        </section>

        <p className="mt-10 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link
            href="/"
            className="font-medium text-violet-700 underline decoration-violet-500/30 underline-offset-2 hover:text-violet-800 dark:text-violet-300 dark:hover:text-violet-200"
          >
            ← Back to home
          </Link>
        </p>
      </article>
    </div>
  );
}