export const CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"] as const;

export type ProductRow = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  images: string[];
  featured: boolean;
  stock: number;
};

export type AdminProduct = ProductRow & {
  description: string;
  sizes: (string | number)[];
};

export type ProductPayload = {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  sizes: string[];
  images: string[];
};