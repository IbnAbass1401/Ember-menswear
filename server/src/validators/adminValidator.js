import { z } from "zod";

export const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(15),
  status: z.enum(ORDER_STATUSES, { error: "Invalid status" }).optional(),
});

// Admins can only move an order to these three (paid is set by payment, not by hand)
export const updateOrderStatusSchema = z.object({
  status: z.enum(["shipped", "delivered", "cancelled"], {
    error: "Status must be shipped, delivered or cancelled",
  }),
});

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(15),
  search: z.string().trim().max(60).optional(),
});