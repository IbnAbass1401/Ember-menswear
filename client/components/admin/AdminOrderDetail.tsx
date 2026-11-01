"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest, ApiError } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import { STATUS_LABEL, formatNaira, type Order } from "@/lib/orders";
import type { AdminOrderDetail as Detail } from "@/lib/admin";
import OrderProgress from "@/components/order/OrderProgress";

type Next = "shipped" | "delivered" | "cancelled";

const ACTION: Partial<Record<Order["status"], { next: Next; label: string; ask: string; danger?: boolean }>> = {
  pending: { next: "cancelled", label: "Cancel order", ask: "Cancel this order?", danger: true },
  paid: { next: "shipped", label: "Mark as shipped", ask: "Mark this order as shipped?" },
  shipped: { next: "delivered", label: "Mark as delivered", ask: "Mark this order as delivered?" },
};

export default function AdminOrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Detail | null>(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiRequest<{ order: Detail }>(`/admin/orders/${id}`);
      setOrder(data.order);
      setError("");
    } catch (err) {
      setError(
        err instanceof ApiError && (err.status === 404 || err.status === 400)
          ? "We couldn't find that order."
          : err instanceof Error
            ? err.message
            : "Something went wrong."
      );
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function applyStatus(next: Next) {
    setActionError("");
    setBusy(true);
    try {
      await apiRequest(`/admin/orders/${id}/status`, { status: next }, "PATCH");
      setConfirming(false);
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Couldn't update the order.");
    } finally {
      setBusy(false);
    }
  }

  const back = (
    <Link href="/admin/orders" className="inline-flex min-h-11 items-center text-sm text-ember hover:underline">
      ← Back to orders
    </Link>
  );

  if (error) {
    return (
      <div>
        {back}
        <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-500/10 p-5 text-sm text-red-300">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div aria-busy="true">
        {back}
        <div className="mt-4 h-8 w-56 animate-pulse rounded-lg bg-surface" />
        <div className="mt-5 h-64 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  const a = order.shippingAddress;
  const action = ACTION[order.status];

  return (
    <div>
      {back}
      <h2 className="mt-2 font-display text-2xl font-bold">Order #{order._id.slice(-8).toUpperCase()}</h2>
      <p className="mt-1 text-sm text-cream/60">
        {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })} ·{" "}
        {STATUS_LABEL[order.status]}
      </p>

      <OrderProgress order={order} />

      <section className="mt-6 rounded-2xl border border-ember/30 bg-surface p-4 sm:p-5">
        <h3 className="font-display text-lg font-semibold">Update status</h3>

        {actionError && (
          <div role="alert" className="mt-3 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {actionError}
          </div>
        )}

        {!action ? (
          <p className="mt-2 text-sm text-cream/60">This order is finished, so there are no more actions.</p>
        ) : confirming ? (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <span className="text-sm">{action.ask}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => applyStatus(action.next)}
                disabled={busy}
                className={`h-11 rounded-xl px-5 text-sm font-semibold transition disabled:opacity-60 ${
                  action.danger
                    ? "bg-red-500/90 text-white hover:bg-red-500"
                    : "bg-ember text-noir hover:shadow-glow"
                }`}
              >
                {busy ? "Saving..." : "Yes, do it"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={busy}
                className="h-11 rounded-xl border border-cream/20 px-5 text-sm font-medium transition hover:border-ember hover:text-ember"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setActionError("");
              setConfirming(true);
            }}
            className={`mt-3 h-12 w-full rounded-xl font-semibold transition sm:w-auto sm:px-8 ${
              action.danger
                ? "border border-red-400/60 text-red-300 hover:bg-red-500/10"
                : "bg-ember text-noir hover:shadow-glow"
            }`}
          >
            {action.label}
          </button>
        )}

        {order.status === "pending" && (
          <p className="mt-3 text-xs text-cream/50">
            Only cancel orders nobody has paid for. Check the Paystack dashboard if you&rsquo;re unsure.
          </p>
        )}
        {order.status === "paid" && (
          <p className="mt-3 text-xs text-cream/50">
            Cancelling a paid order isn&rsquo;t supported here yet. Refund it in the Paystack dashboard.
          </p>
        )}
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-cream/10 bg-surface p-4 sm:p-5">
          <h3 className="font-display text-lg font-semibold">Customer</h3>
          <p className="mt-2 font-medium">{order.customer?.name ?? "Deleted user"}</p>
          <p className="break-all text-sm text-cream/60">{order.customer?.email}</p>

          <h3 className="mt-5 font-display text-lg font-semibold">Deliver to</h3>
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
            <a href={`tel:${a.phone}`} className="text-ember hover:underline">
              {a.phone}
            </a>
          </address>
        </section>

        <section className="rounded-2xl border border-cream/10 bg-surface p-4 sm:p-5">
          <h3 className="font-display text-lg font-semibold">Payment</h3>
          {order.amountChargedKobo ? (
            <dl className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-cream/60">Charged</dt>
                <dd>{formatNaira(order.amountChargedKobo / 100)}</dd>
              </div>
              {order.usdNgnRate ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-cream/60">Rate used</dt>
                  <dd>₦{order.usdNgnRate.toLocaleString("en-NG")} / $1</dd>
                </div>
              ) : null}
              {order.paidAt && (
                <div className="flex justify-between gap-3">
                  <dt className="text-cream/60">Paid on</dt>
                  <dd>{new Date(order.paidAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</dd>
                </div>
              )}
              {order.paymentReference && (
                <div>
                  <dt className="text-cream/60">Reference</dt>
                  <dd className="mt-1 break-all text-xs">{order.paymentReference}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-2 text-sm text-cream/60">Payment hasn&rsquo;t been started yet.</p>
          )}

          {order.stockIssue && (
            <div role="alert" className="mt-4 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm">
              Stock ran out after this order was paid. Check inventory before shipping.
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-cream/10 bg-surface p-4 sm:p-5">
        <h3 className="font-display text-lg font-semibold">Items</h3>
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
    </div>
  );
}