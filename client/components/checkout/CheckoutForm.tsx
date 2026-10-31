"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/Field";
import { useAuth } from "@/store/auth";
import { useCart } from "@/store/cart";
import { apiRequest } from "@/lib/client-api";
import { formatPrice } from "@/lib/api";
import { FREE_SHIPPING_OVER, SHIPPING_FEE, type Order } from "@/lib/orders";

type Form = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

type Errors = Partial<Record<keyof Form, string>>;

function validate(f: Form): Errors {
  const e: Errors = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (f.phone.trim().length < 7) e.phone = "Enter a valid phone number.";
  if (f.address.trim().length < 5) e.address = "Enter your street address.";
  if (f.city.trim().length < 2) e.city = "Enter your city.";
  if (f.state.trim().length < 2) e.state = "Enter your state.";
  if (f.country.trim().length < 2) e.country = "Enter your country.";
  return e;
}

export default function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const setOpen = useCart((s) => s.setOpen);

  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<Form>(() => ({
    fullName: useAuth.getState().user?.name ?? "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
  }));
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Wait until the saved cart has been loaded from localStorage
  useEffect(() => {
    if (useCart.persist.hasHydrated()) setReady(true);
    return useCart.persist.onFinishHydration(() => setReady(true));
  }, []);

  const set = (key: keyof Form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const itemsTotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const shippingFee = itemsTotal > FREE_SHIPPING_OVER ? 0 : SHIPPING_FEE;
  const total = itemsTotal + shippingFee;
  const remaining = FREE_SHIPPING_OVER - itemsTotal;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      // jump to the first problem so it's visible on small screens
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      );
      return;
    }
    if (!items.length) return;

    setBusy(true);
    try {
      const data = await apiRequest<{ order: Order }>(
        "/orders",
        {
          items: items.map((i) => ({
            productId: i.id,
            size: i.size || undefined,
            qty: i.qty,
          })),
          shippingAddress: {
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            state: form.state.trim(),
            country: form.country.trim(),
            postalCode: form.postalCode.trim() || undefined,
          },
        },
        "POST"
      );
      setPlaced(true);
      router.push(`/order/${data.order._id}`);
      clear();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't place your order. Try again.");
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10" aria-busy="true">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-surface" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (placed) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-20 text-center">
        <p className="font-display text-xl font-semibold">Placing your order...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-cream/70">Add something sharp before you check out.</p>
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
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold">Checkout</h1>

      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start"
      >
        {/* Delivery details */}
        <section>
          <h2 className="font-display text-xl font-semibold">Delivery details</h2>
          <div className="mt-5 space-y-5">
            <Field
              label="Full name"
              value={form.fullName}
              onChange={set("fullName")}
              error={errors.fullName}
              autoComplete="name"
            />
            <Field
              label="Phone number"
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              error={errors.phone}
              autoComplete="tel"
              placeholder="08012345678"
            />
            <Field
              label="Street address"
              value={form.address}
              onChange={set("address")}
              error={errors.address}
              autoComplete="street-address"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="City"
                value={form.city}
                onChange={set("city")}
                error={errors.city}
                autoComplete="address-level2"
              />
              <Field
                label="State"
                value={form.state}
                onChange={set("state")}
                error={errors.state}
                autoComplete="address-level1"
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Country"
                value={form.country}
                onChange={set("country")}
                error={errors.country}
                autoComplete="country-name"
              />
              <Field
                label="Postal code (optional)"
                value={form.postalCode}
                onChange={set("postalCode")}
                autoComplete="postal-code"
              />
            </div>
          </div>
        </section>

        {/* Order summary */}
        <section className="rounded-2xl border border-cream/10 bg-surface p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Order summary</h2>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 items-center px-2 text-sm text-ember hover:underline"
            >
              Edit cart
            </button>
          </div>

          <ul className="mt-3 divide-y divide-cream/10">
            {items.map((i) => (
              <li key={i.key} className="flex gap-3 py-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-rust/40 to-noir">
                  {i.image && (
                    <img src={i.image} alt="" className="h-full w-full object-cover" />
                  )}
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
              <dd>{formatPrice(itemsTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cream/70">Delivery</dt>
              <dd>{shippingFee === 0 ? "Free" : formatPrice(shippingFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-cream/10 pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          {remaining > 0 && (
            <p className="mt-3 text-xs text-cream/60">
              Add {formatPrice(remaining)} more for free delivery.
            </p>
          )}

          {formError && (
            <div
              role="alert"
              className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
            >
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-5 h-12 w-full rounded-xl bg-ember font-semibold text-noir transition hover:shadow-glow active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? "Placing order..." : `Place order · ${formatPrice(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-cream/50">
            Payment comes next. 7-day easy returns.
          </p>
        </section>
      </form>
    </div>
  );
}