import { z } from "zod";

// Keep in sync with the categories in models/Product.js
const CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"];

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48, "Limit can't be more than 48").default(12),
  category: z.enum(CATEGORIES, { error: "Invalid category" }).optional(),
  search: z.string().trim().max(60).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z
    .enum(["newest", "price-asc", "price-desc", "name"], { error: "Invalid sort option" })
    .default("newest"),
  featured: z.enum(["true", "false"]).optional(),
});

const productFields = {
  name: z.string({ error: "Name is required" }).trim().min(2, "Name is too short").max(120),
  description: z.string().trim().max(2000).optional(),
  price: z.number({ error: "Price must be a number" }).min(0, "Price can't be negative"),
  category: z.enum(CATEGORIES, { error: "Invalid category" }),
  images: z.array(z.string().trim().min(1)).optional(),
  sizes: z.array(z.string().trim().min(1)).optional(),
  stock: z.number({ error: "Stock must be a number" }).int().min(0).optional(),
  featured: z.boolean().optional(),
};

export const createProductSchema = z.object(productFields);
export const updateProductSchema = z.object(productFields).partial();