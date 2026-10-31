import { z } from "zod";

export const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid product"),
        size: z.string().trim().max(10).optional(),
        qty: z.number().int().min(1, "Quantity must be at least 1").max(10, "Max 10 per item"),
      })
    )
    .min(1, "Your cart is empty")
    .max(30, "Too many items in one order"),
  shippingAddress: z.object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80),
    phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
    address: z.string().trim().min(5, "Enter your street address").max(200),
    city: z.string().trim().min(2, "Enter your city").max(80),
    state: z.string().trim().min(2, "Enter your state").max(80),
    country: z.string().trim().min(2, "Enter your country").max(80),
    postalCode: z.string().trim().max(20).optional(),
  }),
});

export const verifyPaymentSchema = z.object({
  reference: z.string().trim().min(5, "Missing payment reference").max(100),
});