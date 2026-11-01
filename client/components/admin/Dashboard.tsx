"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import { STATUS_LABEL, type Order } from "@/lib/orders";
import type { AdminStats } from "@/lib/admin";

const STATUS_ORDER: Order["status"][] = ["pending", "paid", "shipped", "delivered", "cancelled"];

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-cream/10 bg-surface p-4 sm:p-5">
      <p className="text-sm text-cream/60">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-cream/50">{hint}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await apiRequest<{ stats: AdminStats }>("/admin/stats");
      setStats(data.stats);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load the dashboard.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function retry() {
    setError("");
    setStats(null);
    load();
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-center">
        <p className="text-sm text-red-300">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-4 h-11 rounded-xl border border-cream/20 px-5 text-sm font-medium transition hover:border-ember hover:text-ember"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div aria-busy="true">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="h-24 animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
        <div className="mt-6 h-48 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatPrice(stats.revenue.total)}
          hint={`${formatPrice(stats.revenue.last30Days)} in the last 30 days`}
        />
        <StatCard label="Orders" value={String(stats.orders.total)} />
        <StatCard label="Customers" value={String(stats.customers)} />
        <StatCard
          label="Products"
          value={String(stats.products.total)}
          hint={stats.products.soldOut ? `${stats.products.soldOut} sold out` : undefined}
        />
      </div>

      <section className="rounded-2xl border border-cream/10 bg-surface p-4 sm:p-5">
        <h2 className="font-display text-lg font-semibold">Orders by status</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {STATUS_ORDER.map((s) => (
            <li key={s} className="rounded-xl border border-cream/10 px-3 py-2">
              <p className="text-xs text-cream/60">{STATUS_LABEL[s]}</p>
              <p className="font-display text-xl font-semibold">{stats.orders.byStatus[s]}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-cream/10 bg-surface p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">Recent orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="mt-3 text-sm text-cream/60">No orders yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-cream/10">
              {stats.recentOrders.map((o) => (
                <li key={o._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      #{o._id.slice(-8).toUpperCase()} · {o.customer?.name ?? "Deleted user"}
                    </p>
                    <p className="text-xs text-cream/60">
                      {new Date(o.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                      {" · "}
                      {STATUS_LABEL[o.status]}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">{formatPrice(o.total)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-cream/10 bg-surface p-4 sm:p-5">
          <h2 className="font-display text-lg font-semibold">Low stock</h2>
          {stats.products.lowStock.length === 0 ? (
            <p className="mt-3 text-sm text-cream/60">Nothing running low. 5 or fewer left counts as low.</p>
          ) : (
            <ul className="mt-2 divide-y divide-cream/10">
              {stats.products.lowStock.map((p) => (
                <li key={p._id}>
                  <Link
                    href={`/product/${p.slug}`}
                    className="flex min-h-11 items-center justify-between gap-3 py-3 transition hover:text-ember"
                  >
                    <span className="min-w-0 truncate text-sm">{p.name}</span>
                    <span className="shrink-0 text-sm text-ember">{p.stock} left</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}