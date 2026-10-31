"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import { STATUS_LABEL, type Order } from "@/lib/orders";

const BADGE: Record<Order["status"], string> = {
  pending: "border-ember/40 text-ember",
  paid: "border-ember bg-ember/15 text-ember",
  shipped: "border-ember bg-ember/15 text-ember",
  delivered: "border-ember bg-ember/15 text-ember",
  cancelled: "border-red-400/50 text-red-300",
};

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await apiRequest<{ orders: Order[] }>("/orders/mine");
      setOrders(data.orders);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load your orders.");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function retry() {
    setError("");
    setOrders(null);
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

  if (!orders) {
    return (
      <div className="space-y-3" aria-busy="true">
        {[0, 1, 2].map((n) => (
          <div key={n} className="h-28 animate-pulse rounded-2xl bg-surface" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-cream/10 bg-surface px-5 py-12 text-center">
        <h2 className="font-display text-xl font-semibold">No orders yet</h2>
        <p className="mt-2 text-sm text-cream/70">When you place an order, it shows up here.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-ember px-6 font-semibold text-noir transition hover:shadow-glow"
        >
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => {
        const summary = order.items
          .map((i) => (i.qty > 1 ? `${i.name} ×${i.qty}` : i.name))
          .join(", ");

        return (
          <li key={order._id}>
            <Link
              href={`/order/${order._id}`}
              className="block rounded-2xl border border-cream/10 bg-surface p-4 transition hover:border-ember/50 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-cream/60">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${BADGE[order.status]}`}
                >
                  {STATUS_LABEL[order.status]}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-cream/70">{summary}</p>

              <div className="mt-3 flex items-center justify-between border-t border-cream/10 pt-3">
                <span className="font-semibold">{formatPrice(order.total)}</span>
                <span className="text-sm text-ember">
                  {order.status === "pending" ? "Pay now →" : "View details →"}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}