import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import CartDrawer from "@/components/cart/CartDrawer";
import CartHydrator from "@/components/cart/CartHydrator";

export const metadata: Metadata = {
  title: "Ember – Menswear",
  description: "Dress sharp. Own the room.",
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