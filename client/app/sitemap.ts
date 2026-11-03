import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

// Built on each request so new products appear, and the build doesn't need the API
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    let page = 1;
    let pages = 1;
    do {
      const data = await getProducts({ page: String(page), limit: "48" });
      for (const p of data.products) {
        entries.push({
          url: `${SITE_URL}/product/${p.slug}`,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
      pages = data.pages;
      page += 1;
    } while (page <= pages && page <= 20);
  } catch {
    // If the API is down, still serve the static pages
  }

  return entries;
}