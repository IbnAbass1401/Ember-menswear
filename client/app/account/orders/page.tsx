import type { Metadata } from "next";
import OrderHistory from "@/components/account/OrderHistory";

export const metadata: Metadata = { title: "My orders | Ember" };

export default function OrdersPage() {
  return <OrderHistory />;
}