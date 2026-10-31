import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import OrderView from "@/components/order/OrderView";

export const metadata: Metadata = { title: "Your order | Ember" };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const reference = sp.reference ?? sp.trxref;

  return (
    <RequireAuth>
      <OrderView id={id} reference={reference} />
    </RequireAuth>
  );
}