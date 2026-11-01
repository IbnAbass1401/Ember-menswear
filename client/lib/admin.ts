import type { Order } from "@/lib/orders";

export type AdminStats = {
  revenue: { total: number; last30Days: number };
  orders: { total: number; byStatus: Record<Order["status"], number> };
  customers: number;
  products: {
    total: number;
    soldOut: number;
    lowStock: { _id: string; name: string; slug: string; stock: number }[];
  };
  recentOrders: {
    _id: string;
    total: number;
    status: Order["status"];
    createdAt: string;
    customer: { name: string; email: string } | null;
  }[];
};

export type AdminOrderRow = {
  _id: string;
  status: Order["status"];
  total: number;
  createdAt: string;
  customer: { name: string; email: string } | null;
  items: { name: string; qty: number }[];
};

export type AdminOrderDetail = Order & {
  customer: { name: string; email: string } | null;
  paymentReference?: string;
  usdNgnRate?: number;
  paystackTransactionId?: string;
  stockIssue?: boolean;
};