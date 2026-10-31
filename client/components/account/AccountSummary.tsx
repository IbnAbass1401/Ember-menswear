"use client";

import Link from "next/link";
import { useAuth } from "@/store/auth";

export default function AccountSummary() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  if (!user) return null;

  async function onLogout() {
    try {
      await logout();
    } catch {
      window.alert("Couldn't log out. Check your connection and try again.");
    }
  }

  return (
    <div className="max-w-md">
      <div className="rounded-2xl border border-cream/10 bg-surface p-5">
        <p className="text-sm text-cream/60">Name</p>
        <p className="font-medium">{user.name}</p>
        <p className="mt-4 text-sm text-cream/60">Email</p>
        <p className="break-all font-medium">{user.email}</p>
      </div>

      <Link
        href="/account/orders"
        className="mt-4 flex h-12 items-center justify-center rounded-xl bg-ember font-semibold text-noir transition hover:shadow-glow"
      >
        View my orders
      </Link>

      <button
        type="button"
        onClick={onLogout}
        className="mt-3 h-12 w-full rounded-xl border border-cream/20 font-medium transition hover:border-ember hover:text-ember"
      >
        Log out
      </button>
    </div>
  );
}