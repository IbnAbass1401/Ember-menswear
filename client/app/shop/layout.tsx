import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Shop the collection",
  description:
    "Browse Ember's shirts, bottoms, outerwear, footwear and accessories. Free delivery over $120 and 7-day easy returns.",
  // Search, sort and page links all count as the same page
  alternates: { canonical: "/shop" },
};

export default function ShopLayout({ children }: { children: ReactNode }) {
  return children;
}