"use client";

import { FormEvent, ReactNode, useState } from "react";
import { CATEGORIES, type AdminProduct, type ProductPayload } from "@/lib/admin-products";

type Props = {
  initial?: AdminProduct;
  submitLabel: string;
  // Return a message (e.g. "Saved.") to show after success, or nothing
  onSubmit: (payload: ProductPayload) => Promise<string | void>;
};

type Errors = Partial<Record<"name" | "description" | "price" | "stock", string>>;

const inputCls = (error?: string) =>
  `w-full rounded-xl border bg-surface px-4 text-base text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-ember ${
    error ? "border-red-400" : "border-cream/15"
  }`;

function Row({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-cream/80">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-cream/50">{hint}</p>}
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default function ProductForm({ initial, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [category, setCategory] = useState<string>(initial?.category ?? CATEGORIES[0]);
  const [stock, setStock] = useState(initial ? String(initial.stock) : "25");
  const [sizes, setSizes] = useState((initial?.sizes ?? []).map(String).join(", "));
  const [images, setImages] = useState((initial?.images ?? []).join("\n"));
  const [featured, setFeatured] = useState(initial?.featured ?? false);

  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    const errs: Errors = {};
    if (name.trim().length < 2) errs.name = "Enter a product name.";
    if (description.trim().length < 10) errs.description = "Add a short description (at least 10 characters).";
    const priceNum = Number(price);
    if (!price.trim() || !Number.isFinite(priceNum) || priceNum <= 0) errs.price = "Enter a price above 0.";
    const stockNum = Number(stock);
    if (!stock.trim() || !Number.isInteger(stockNum) || stockNum < 0) errs.stock = "Enter a whole number, 0 or more.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() =>
        document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      );
      return;
    }

    const payload: ProductPayload = {
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      category,
      stock: stockNum,
      featured,
      sizes: [...new Set(sizes.split(",").map((s) => s.trim()).filter(Boolean))],
      images: images.split("\n").map((s) => s.trim()).filter(Boolean),
    };

    setBusy(true);
    try {
      const message = await onSubmit(payload);
      if (message) setSuccess(message);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save the product. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl space-y-5">
      {formError && (
        <div role="alert" className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </div>
      )}
      {success && (
        <div role="status" className="rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm">
          {success}
        </div>
      )}

      <Row label="Name" htmlFor="p-name" error={errors.name}>
        <input
          id="p-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          className={`h-12 ${inputCls(errors.name)}`}
        />
      </Row>

      <Row label="Description" htmlFor="p-desc" error={errors.description}>
        <textarea
          id="p-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-invalid={!!errors.description}
          rows={4}
          className={`min-h-28 py-3 ${inputCls(errors.description)}`}
        />
      </Row>

      <div className="grid gap-5 sm:grid-cols-2">
        <Row label="Price (USD)" htmlFor="p-price" error={errors.price}>
          <input
            id="p-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
            placeholder="49.99"
            aria-invalid={!!errors.price}
            className={`h-12 ${inputCls(errors.price)}`}
          />
        </Row>
        <Row label="Stock" htmlFor="p-stock" error={errors.stock}>
          <input
            id="p-stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            inputMode="numeric"
            aria-invalid={!!errors.stock}
            className={`h-12 ${inputCls(errors.stock)}`}
          />
        </Row>
      </div>

      <Row label="Category" htmlFor="p-category">
        <select
          id="p-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`h-12 ${inputCls()}`}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Row>

      <Row
        label="Sizes"
        htmlFor="p-sizes"
        hint="Separate with commas, e.g. S, M, L, XL or 40, 41, 42. Leave empty for accessories."
      >
        <input
          id="p-sizes"
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
          className={`h-12 ${inputCls()}`}
        />
      </Row>

      <Row
        label="Image links"
        htmlFor="p-images"
        hint="One link per line. Leave empty for now: photo uploads come in a later step."
      >
        <textarea
          id="p-images"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          rows={3}
          className={`min-h-24 py-3 ${inputCls()}`}
        />
      </Row>

      <label className="flex min-h-11 cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-5 w-5 accent-ember"
        />
        <span className="text-sm">Show on the home page (featured)</span>
      </label>

      <button
        type="submit"
        disabled={busy}
        className="h-12 w-full rounded-xl bg-ember font-semibold text-noir transition hover:shadow-glow active:scale-[0.99] disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {busy ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}