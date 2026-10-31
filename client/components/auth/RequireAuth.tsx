"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

export default function RequireAuth({
  children,
  role,
}: {
  children: ReactNode;
  role?: "admin";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const status = useAuth((s) => s.status);
  const user = useAuth((s) => s.user);
  const init = useAuth((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (status === "guest") {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  // Checking the cookie, or about to redirect: show a calm placeholder
  if (status !== "authed") {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16" aria-busy="true">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-surface" />
        <div className="mt-4 h-24 animate-pulse rounded-2xl bg-surface" />
      </div>
    );
  }

  if (role && user?.role !== role) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">No access</h1>
        <p className="mt-2 text-cream/70">This page is for admins only.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-12 items-center rounded-xl bg-ember px-6 font-semibold text-noir"
        >
          Back home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}