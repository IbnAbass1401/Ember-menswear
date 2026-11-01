"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { apiRequest } from "@/lib/client-api";
import type { ProductPayload } from "@/lib/admin-products";

export default function ProductCreate() {
  const router = useRouter();

  async function create(payload: ProductPayload) {
    await apiRequest("/products", payload, "POST");
    router.push("/admin/products");
  }

  return (
    <div>
      <Link href="/admin/products" className="inline-flex min-h-11 items-center text-sm text-ember hover:underline">
        ← Back to products
      </Link>
      <h2 className="mt-2 font-display text-2xl font-bold">Add product</h2>
      <div className="mt-5">
        <ProductForm submitLabel="Add product" onSubmit={create} />
      </div>
    </div>
  );
}