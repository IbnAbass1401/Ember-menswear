"use client";

import { useState } from "react";
import { useCart } from "@/store/cart";
import type { Product } from "@/lib/api";

export default function AddToCart({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const sizes = product.sizes ?? [];
  const [size, setSize] = useState<string | null>(null);
  const [needSize, setNeedSize] = useState(false);
  const soldOut = product.stock <= 0;

  function handleAdd() {
    if (sizes.length > 0 && !size) {
      setNeedSize(true);
      return;
    }
    add({
      id: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      size: size ?? undefined,
    });
  }

  return (
    <div>
      {sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm text-cream/70">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSize(s);
                  setNeedSize(false);
                }}
                aria-pressed={size === s}
                className={`min-h-11 min-w-11 rounded-lg border px-3 font-medium transition ${
                  size === s
                    ? "border-ember bg-ember/10 text-ember shadow-glow"
                    : "border-cream/20 text-cream/80 hover:border-ember/60"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          {needSize && <p className="mt-2 text-sm text-ember">Please choose a size first.</p>}
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={soldOut}
        className="mt-6 min-h-12 w-full rounded-xl bg-ember font-bold text-noir transition hover:-translate-y-0.5 hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {soldOut ? "Sold out" : "Add to cart"}
      </button>
    </div>
  );
}