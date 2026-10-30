import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, formatPrice } from "@/lib/api";
import AddToCart from "@/components/product/AddToCart";
import Photo from "@/components/ui/Photo";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <Link href="/shop" className="inline-flex min-h-11 items-center text-sm text-cream/60 transition hover:text-ember">
        ← Back to shop
      </Link>

      <div className="mt-2 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative">
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-ember/10 blur-3xl" />
          <Photo
            src={product.images?.[0]}
            alt={product.name}
            label
            className="relative aspect-4/5 w-full rounded-2xl border border-ember/15"
          />
        </div>

        <div>
          <p className="text-sm text-cream/50">{product.category}</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-2xl font-bold text-ember">{formatPrice(product.price)}</p>
          {product.description && <p className="mt-5 max-w-prose text-cream/75">{product.description}</p>}

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <ul className="mt-8 space-y-1 border-t border-ember/15 pt-5 text-sm text-cream/60">
            <li>Free delivery over $120</li>
            <li>7-day easy returns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}