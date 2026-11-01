"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// More tabs get added as we build Orders and Users
const TABS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin"
      className="-mx-4 flex gap-2 overflow-x-auto border-b border-cream/10 px-4 sm:mx-0 sm:px-0"
    >
      {TABS.map((tab) => {
        const active = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 shrink-0 items-center border-b-2 px-4 text-sm font-medium transition ${
              active
                ? "border-ember text-ember"
                : "border-transparent text-cream/70 hover:text-cream"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}