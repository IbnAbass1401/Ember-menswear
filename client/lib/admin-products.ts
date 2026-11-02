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

// Image upload limits (must match server/src/middleware/upload.js)
export const IMAGE_TYPES: string[] = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGES = 6;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

// Sends the files to the server, which uploads them to Cloudinary.
// Returns the hosted image URLs. (Uses FormData, so no JSON Content-Type header.)
export async function uploadProductImages(files: File[]): Promise<string[]> {
  const body = new FormData();
  files.forEach((file) => body.append("images", file));

  let res: Response;
  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/uploads`, {
      method: "POST",
      body,
      credentials: "include",
    });
  } catch {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.message ?? "Upload failed. Try again.");
  }
  return data.images as string[];
}