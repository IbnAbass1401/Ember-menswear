"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import type { ProductRow } from "@/lib/admin-products";

type ListData = { total: number; page: number; pages: number; products: ProductRow[] };

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="rounded-full border border-red-400/50 px-2 py-0.5 text-xs text-red-300">Sold out</span>;
  if (stock <= 5)
    return <span className="rounded-full border border-ember/50 px-2 py-0.5 text-xs text-ember">Low: {stock}</span>;
  return <span className="text-xs text-cream/60">{stock} in stock</span>;
}

export default function ProductList() {
  const [data, setData] = useState<ListData | null>(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12", sort: "newest" });
      if (query) params.set("search", query);
      const res = await apiRequest<ListData>(`/products?${params}`);
      setData(res);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load products.");
    }
  }, [page, query]);

  useEffect(() => {
    load();
  }, [load]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setData(null);
    setPage(1);
    setQuery(searchInput.trim());
  }

  function goTo(next: number) {
    setData(null);
    setPage(next);
  }

  async function onDelete(id: string) {
    setActionError("");
    setDeletingId(id);
    try {
      await apiRequest(`/products/${id}`, undefined, "DELETE");
      setConfirmId(null);
      // if that was the last product on this page, step back one page
      if (data && data.products.length === 1 && page > 1) goTo(page - 1);
      else await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Couldn't delete that product.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form onSubmit={onSearch} className="flex flex-1 gap-2 sm:max-w-md">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="h-12 min-w-0 flex-1 rounded-xl border border-cream/15 bg-surface px-4 text-base text-cream outline-none placeholder:text-cream/40 focus:border-ember"
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-xl border border-cream/20 px-5 text-sm font-medium transition hover:border-ember hover:text-ember"
          >
            Search
          </button>
        </form>
        <Link
          href="/admin/products/new"
          className="flex h-12 items-center justify-center rounded-xl bg-ember px-6 font-semibold text-noir transition hover:shadow-glow"
        >
          + Add product
        </Link>
      </div>

      {actionError && (
        <div role="alert" className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {actionError}
        </div>
      )}

      <div className="mt-5">
        {error ? (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-center">
            <p className="text-sm text-red-300">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError("");
                load();
              }}
              className="mt-4 h-11 rounded-xl border border-cream/20 px-5 text-sm font-medium transition hover:border-ember hover:text-ember"
            >
              Try again
            </button>
          </div>
        ) : !data ? (
          <div className="space-y-3" aria-busy="true">
            {[0, 1, 2, 3].map((n) => (
              <div key={n} className="h-24 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : data.products.length === 0 ? (
          <div className="rounded-2xl border border-cream/10 bg-surface px-5 py-12 text-center">
            <p className="font-display text-xl font-semibold">No products found</p>
            <p className="mt-2 text-sm text-cream/70">
              {query ? "Try a different search." : "Add your first product."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-cream/60">
              {data.total} product{data.total === 1 ? "" : "s"}
              {query ? ` matching “${query}”` : ""}
            </p>
            <ul className="space-y-3">
              {data.products.map((p) => (
                <li key={p._id} className="rounded-2xl border border-cream/10 bg-surface p-4">
                  <div className="flex gap-3">
                    <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-rust/40 to-noir">
                      {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-sm text-cream/60">
                        {p.category} · {formatPrice(p.price)}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <StockBadge stock={p.stock} />
                        {p.featured && (
                          <span className="rounded-full border border-cream/20 px-2 py-0.5 text-xs text-cream/70">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 border-t border-cream/10 pt-3">
                    {confirmId === p._id ? (
                      <>
                        <span className="mr-auto text-sm">Delete this product?</span>
                        <button
                          type="button"
                          onClick={() => onDelete(p._id)}
                          disabled={deletingId === p._id}
                          className="h-11 rounded-xl bg-red-500/90 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
                        >
                          {deletingId === p._id ? "Deleting..." : "Yes, delete"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="h-11 rounded-xl border border-cream/20 px-4 text-sm font-medium transition hover:border-ember hover:text-ember"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href={`/admin/products/${p.slug}`}
                          className="flex h-11 items-center rounded-xl border border-ember/60 px-5 text-sm font-medium text-ember transition hover:bg-ember hover:text-noir"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setActionError("");
                            setConfirmId(p._id);
                          }}
                          className="h-11 rounded-xl border border-cream/20 px-5 text-sm font-medium transition hover:border-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {data.pages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goTo(page - 1)}
                  className="h-11 rounded-xl border border-cream/20 px-5 text-sm font-medium transition enabled:hover:border-ember enabled:hover:text-ember disabled:opacity-40"
                >
                  ← Previous
                </button>
                <span className="text-sm text-cream/60">
                  Page {data.page} of {data.pages}
                </span>
                <button
                  type="button"
                  disabled={page >= data.pages}
                  onClick={() => goTo(page + 1)}
                  className="h-11 rounded-xl border border-cream/20 px-5 text-sm font-medium transition enabled:hover:border-ember enabled:hover:text-ember disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}