"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import { STATUS_LABEL, type Order } from "@/lib/orders";
import type { AdminOrderRow } from "@/lib/admin";

type ListData = { total: number; page: number; pages: number; orders: AdminOrderRow[] };
type Filter = "" | Order["status"];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "", label: "All" },
  { value: "pending", label: "Awaiting payment" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const BADGE: Record<Order["status"], string> = {
  pending: "border-ember/40 text-ember",
  paid: "border-ember bg-ember/15 text-ember",
  shipped: "border-ember bg-ember/15 text-ember",
  delivered: "border-ember bg-ember/15 text-ember",
  cancelled: "border-red-400/50 text-red-300",
};

export default function OrderList() {
  const [data, setData] = useState<ListData | null>(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Filter>("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (status) params.set("status", status);
      const res = await apiRequest<ListData>(`/admin/orders?${params}`);
      setData(res);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load orders.");
    }
  }, [page, status]);

  useEffect(() => {
    load();
  }, [load]);

  function pickFilter(value: Filter) {
    if (value === status) return;
    setData(null);
    setPage(1);
    setStatus(value);
  }

  function goTo(next: number) {
    setData(null);
    setPage(next);
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Filter by status"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {FILTERS.map((f) => {
          const active = f.value === status;
          return (
            <button
              key={f.label}
              type="button"
              onClick={() => pickFilter(f.value)}
              aria-pressed={active}
              className={`flex h-11 shrink-0 items-center rounded-full border px-4 text-sm font-medium transition ${
                active
                  ? "border-ember bg-ember text-noir"
                  : "border-cream/20 text-cream/80 hover:border-ember hover:text-ember"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

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
              <div key={n} className="h-28 animate-pulse rounded-2xl bg-surface" />
            ))}
          </div>
        ) : data.orders.length === 0 ? (
          <div className="rounded-2xl border border-cream/10 bg-surface px-5 py-12 text-center">
            <p className="font-display text-xl font-semibold">No orders here</p>
            <p className="mt-2 text-sm text-cream/70">
              {status ? "Nothing with that status right now." : "Orders will show up as customers place them."}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-cream/60">
              {data.total} order{data.total === 1 ? "" : "s"}
            </p>
            <ul className="space-y-3">
              {data.orders.map((o) => {
                const summary = o.items.map((i) => (i.qty > 1 ? `${i.name} ×${i.qty}` : i.name)).join(", ");
                return (
                  <li key={o._id}>
                    <Link
                      href={`/admin/orders/${o._id}`}
                      className="block rounded-2xl border border-cream/10 bg-surface p-4 transition hover:border-ember/50 sm:p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium">Order #{o._id.slice(-8).toUpperCase()}</p>
                          <p className="truncate text-sm text-cream/60">
                            {o.customer ? `${o.customer.name} · ${o.customer.email}` : "Deleted user"}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${BADGE[o.status]}`}
                        >
                          {STATUS_LABEL[o.status]}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-1 text-sm text-cream/70">{summary}</p>
                      <div className="mt-3 flex items-center justify-between border-t border-cream/10 pt-3">
                        <span className="text-sm text-cream/60">
                          {new Date(o.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                        </span>
                        <span className="font-semibold">{formatPrice(o.total)}</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
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