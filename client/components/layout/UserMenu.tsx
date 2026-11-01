"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/auth";

export default function UserMenu() {
  const user = useAuth((s) => s.user);
  const status = useAuth((s) => s.status);
  const init = useAuth((s) => s.init);
  const logout = useAuth((s) => s.logout);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    init();
  }, [init]);

  // Close on outside tap or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Reserve the space so the navbar doesn't jump
  if (status === "idle" || status === "loading") {
    return <div className="h-11 w-11" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex h-11 items-center rounded-full px-4 text-sm font-medium text-cream/80 hover:text-ember"
      >
        Log in
      </Link>
    );
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  async function onLogout() {
    setOpen(false);
    try {
      await logout();
    } catch {
      window.alert("Couldn't log out. Check your connection and try again.");
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-surface font-display font-bold text-ember ring-1 ring-cream/15 transition hover:ring-ember"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-cream/10 bg-surface p-2 shadow-xl">
          <div className="px-3 py-2">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-sm text-cream/60">{user.email}</p>
          </div>
          <Link
            href="/account"
            onClick={() => setOpen(false)}
            className="flex h-11 items-center rounded-xl px-3 hover:bg-cream/5"
          >
            My account
          </Link>
          <Link
            href="/account/orders"
            onClick={() => setOpen(false)}
            className="flex h-11 items-center rounded-xl px-3 hover:bg-cream/5"
          >
            My orders
          </Link>
          {user.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex h-11 items-center rounded-xl px-3 text-ember hover:bg-cream/5"
            >
              Admin
            </Link>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="flex h-11 w-full items-center rounded-xl px-3 text-left hover:bg-cream/5"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}