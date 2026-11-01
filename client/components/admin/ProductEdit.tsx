"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductForm from "@/components/admin/ProductForm";
import { apiRequest, ApiError } from "@/lib/client-api";
import type { AdminProduct, ProductPayload } from "@/lib/admin-products";

export default function ProductEdit({ slug }: { slug: string }) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest<{ product?: AdminProduct } & Partial<AdminProduct>>(`/products/${slug}`)
      .then((data) => {
        if (cancelled) return;
        const p = (data.product ?? data) as AdminProduct;
        if (!p?._id) setError("Couldn't read that product.");
        else setProduct(p);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError && err.status === 404
            ? "We couldn't find that product."
            : err instanceof Error
              ? err.message
              : "Something went wrong."
        );
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function save(payload: ProductPayload) {
    await apiRequest(`/products/${product!._id}`, payload, "PATCH");
    return "Saved.";
  }

  return (
    <div>
      <Link href="/admin/products" className="inline-flex min-h-11 items-center text-sm text-ember hover:underline">
        ← Back to products
      </Link>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      ) : !product ? (
        <div className="mt-4 space-y-4" aria-busy="true">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-surface" />
          <div className="h-72 max-w-2xl animate-pulse rounded-2xl bg-surface" />
        </div>
      ) : (
        <>
          <h2 className="mt-2 font-display text-2xl font-bold">Edit product</h2>
          <p className="mt-1 text-sm text-cream/60">
            Public page:{" "}
            <Link href={`/product/${product.slug}`} className="text-ember hover:underline">
              /product/{product.slug}
            </Link>
          </p>
          <div className="mt-5">
            <ProductForm initial={product} submitLabel="Save changes" onSubmit={save} />
          </div>
        </>
      )}
    </div>
  );
}