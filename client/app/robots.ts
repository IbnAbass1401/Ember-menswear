import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private or useless-to-search pages
      disallow: ["/admin", "/account", "/checkout", "/order", "/login", "/register", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}