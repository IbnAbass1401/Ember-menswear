import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-cream/70">That page doesn&apos;t exist, or the product is gone.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-ember px-7 font-bold text-noir transition hover:shadow-glow-lg"
        >
          Back to shop
        </Link>
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