import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-cream/70">That page doesn&apos;t exist, or the product is gone.</p>
      <Link
        href="/shop"
        className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-ember px-7 font-bold text-noir transition hover:shadow-glow-lg"
      >
        Back to shop
      </Link>
    </div>
  );
}