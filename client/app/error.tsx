"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-3 text-cream/70">
        We couldn&apos;t load this page. Check that the API is running, then try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 min-h-12 rounded-xl bg-ember px-7 font-bold text-noir transition hover:shadow-glow-lg"
      >
        Try again
      </button>
    </div>
  );
}