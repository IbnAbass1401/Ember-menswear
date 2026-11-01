export type AdminUserRow = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  orders: number;
  spent: number;
};