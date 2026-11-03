import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import CartHydrator from "@/components/cart/CartHydrator";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const description =
  "Shop men's shirts, denim, jackets, shoes and accessories at Ember. Free delivery over $120 and 7-day easy returns.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ember Menswear | Dress sharp. Own the room.",
    template: "%s | Ember",
  },
  description,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Ember Menswear | Dress sharp. Own the room.",
    description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ember Menswear | Dress sharp. Own the room.",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E0904",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-noir font-sans text-cream antialiased">
        <CartHydrator />
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-ember/15 px-4 py-8 text-center text-sm text-cream/50">
          © 2026 Ember Menswear
        </footer>
        <CartDrawer />
      </body>
    </html>
  );
}