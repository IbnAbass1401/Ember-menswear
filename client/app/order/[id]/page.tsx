import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import OrderView from "@/components/order/OrderView";

export const metadata: Metadata = { title: "Your order | Ember" };

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RequireAuth>
      <OrderView id={id} />
    </RequireAuth>
  );
}