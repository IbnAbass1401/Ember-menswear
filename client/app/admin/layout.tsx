import type { Metadata } from "next";
import type { ReactNode } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin | Ember",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth role="admin">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="font-display text-3xl font-bold">Admin</h1>
        <div className="mt-5">
          <AdminNav />
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </RequireAuth>
  );
}