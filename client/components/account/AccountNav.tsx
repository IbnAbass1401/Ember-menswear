"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Account"
      className="-mx-4 flex gap-2 overflow-x-auto border-b border-cream/10 px-4 sm:mx-0 sm:px-0"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
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