export const FREE_SHIPPING_OVER = 120; // must match the server
export const SHIPPING_FEE = 8; // must match the server

export type OrderItem = {
  product: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  size?: string;
  qty: number;
};

export type Order = {
  _id: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  itemsTotal: number;
  shippingFee: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
};

export const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};