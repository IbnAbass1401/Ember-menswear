"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, ApiError } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import { STATUS_LABEL, type Order } from "@/lib/orders";

export default function OrderView({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    apiRequest<{ order: Order }>(`/orders/${id}`)
      .then((data) => {
        if (!cancelled) setOrder(data.order);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) {
          setError("We couldn't find that order.");
        } else {
          setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">{error}</h1>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-ember px-6 font-semibold text-noir transition hover:shadow-glow"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10" aria-busy="true">
        <div className="h-8 w-56 animate-pulse rounded-lg bg-surface" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  const a = order.shippingAddress;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Order received</h1>
      <p className="mt-2 text-cream/70">
        Order #{order._id.slice(-8).toUpperCase()} ·{" "}
        {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
      </p>

      <span className="mt-4 inline-flex items-center rounded-full border border-ember/40 px-3 py-1 text-sm text-ember">
        {STATUS_LABEL[order.status]}
      </span>
      {order.status === "pending" && (
        <p className="mt-3 text-sm text-cream/60">Online payment is coming soon.</p>
      )}

      <section className="mt-8 rounded-2xl border border-cream/10 bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">Items</h2>
        <ul className="mt-2 divide-y divide-cream/10">
          {order.items.map((i, idx) => (
            <li key={`${i.slug}-${i.size ?? ""}-${idx}`} className="flex gap-3 py-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-rust/40 to-noir">
                {i.image && <img src={i.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{i.name}</p>
                <p className="text-xs text-cream/60">
                  {i.size ? `Size ${i.size} · ` : ""}Qty {i.qty}
                </p>
              </div>
              <p className="text-sm font-medium">{formatPrice(i.price * i.qty)}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-3 space-y-2 border-t border-cream/10 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-cream/70">Subtotal</dt>
            <dd>{formatPrice(order.itemsTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-cream/70">Delivery</dt>
            <dd>{order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-cream/10 pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-cream/10 bg-surface p-5">
        <h2 className="font-display text-lg font-semibold">Delivery to</h2>
        <address className="mt-2 text-sm not-italic leading-relaxed text-cream/80">
          {a.fullName}
          <br />
          {a.address}
          <br />
          {a.city}, {a.state}
          {a.postalCode ? ` ${a.postalCode}` : ""}
          <br />
          {a.country}
          <br />
          {a.phone}
        </address>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/shop"
          className="flex h-12 items-center justify-center rounded-xl bg-ember px-6 font-semibold text-noir transition hover:shadow-glow"
        >
          Continue shopping
        </Link>
        <Link
          href="/account"
          className="flex h-12 items-center justify-center rounded-xl border border-cream/20 px-6 font-medium transition hover:border-ember hover:text-ember"
        >
          My account
        </Link>
      </div>
    </div>
  );
}