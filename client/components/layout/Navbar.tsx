"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "@/store/cart";

export default function Navbar() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const setOpen = useCart((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-30 border-b border-ember/15 bg-noir/85 pt-[env(safe-area-inset-top)] backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2 sm:gap-6">
          <Link href="/shop" className="flex min-h-11 items-center px-3 text-cream/70 transition hover:text-ember">
            Shop
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Open cart, ${count} items`}
            className="relative flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-ember/60 px-3 text-ember transition hover:bg-ember hover:text-noir hover:shadow-glow"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 7h12l-1 12H7L6 7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <span
                key={count}
                className="absolute -right-2 -top-2 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-ember px-1 text-xs font-bold text-noir"
              >
                {count}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}