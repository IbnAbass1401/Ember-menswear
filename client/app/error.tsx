"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-3 text-cream/70">
        We couldn&apos;t load this page. Check your connection and try again.
      </p>

      {/* Only visible while developing */}
      {process.env.NODE_ENV === "development" && error.message && (
        <p className="mt-4 wrap-break-words rounded-lg bg-surface px-3 py-2 text-left text-xs text-cream/60">
          {error.message}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={reset}
          className="min-h-12 rounded-xl bg-ember px-7 font-bold text-noir transition hover:shadow-glow-lg"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-ember/40 px-7 font-semibold text-ember transition hover:bg-ember/15"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}