const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"] as const;

export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  images?: string[];
  featured?: boolean;
  stock: number;
  description?: string;
  sizes?: string[];
};

export type ProductList = {
  total: number;
  page: number;
  pages: number;
  count: number;
  products: Product[];
};

export async function getProducts(
  params: Record<string, string | undefined> = {}
): Promise<ProductList> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);

  const res = await fetch(`${API}/products?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load products");
  return res.json();
}

export async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${API}/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load product");
  const data = await res.json();
  return data.product;
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);