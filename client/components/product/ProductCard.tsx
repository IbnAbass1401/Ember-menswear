import Link from "next/link";
import type { Product } from "@/lib/api";
import { formatPrice } from "@/lib/api";
import Photo from "@/components/ui/Photo";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group relative block">
      {/* backlit glow, only visible on hover */}
      <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-ember/0 blur-2xl transition duration-500 group-hover:bg-ember/20" />
      <article className="relative overflow-hidden rounded-2xl border border-ember/10 bg-surface transition duration-300 group-hover:-translate-y-1 group-hover:border-ember/40">
        <div className="relative overflow-hidden">
          <Photo
            src={product.images?.[0]}
            alt={product.name}
            label
            className="aspect-[4/5 w-full transition duration-500 group-hover:scale-105"
          />
          {product.stock <= 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-noir/85 px-2.5 py-1 text-xs text-cream">
              Sold out
            </span>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <p className="text-xs text-cream/50">{product.category}</p>
          <h3 className="mt-0.5 font-display text-sm font-semibold leading-snug sm:text-base">
            {product.name}
          </h3>
          <p className="mt-2 font-bold text-ember">{formatPrice(product.price)}</p>
        </div>
      </article>
    </Link>
  );
}