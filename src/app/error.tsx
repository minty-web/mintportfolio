"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0a0a0a] px-6">
      <div className="w-full max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#ff4d24]">
          Server error
        </p>
        <h1 className="mt-4 font-sans text-4xl font-semibold tracking-tight text-[#f2f2ef]">
          Something went wrong.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[rgba(242,242,239,0.55)]">
          If you just deployed, the usual cause is missing environment
          variables. Set{" "}
          <span className="font-mono text-[#f2f2ef]">SESSION_SECRET</span>,{" "}
          <span className="font-mono text-[#f2f2ef]">ADMIN_USERNAME</span> and{" "}
          <span className="font-mono text-[#f2f2ef]">ADMIN_PASSWORD_HASH</span>{" "}
          in Netlify → Site configuration → Environment variables, then
          redeploy.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="border border-[rgba(242,242,239,0.2)] px-4 py-2 text-sm text-[#f2f2ef] transition-colors hover:border-[#f2f2ef]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm text-[rgba(242,242,239,0.55)] transition-colors hover:text-[#f2f2ef]"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
