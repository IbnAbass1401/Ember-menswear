import type { Metadata } from "next";
import type { ReactNode } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import AccountNav from "@/components/account/AccountNav";

export const metadata: Metadata = { title: "My account | Ember" };

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <h1 className="font-display text-3xl font-bold">My account</h1>
        <div className="mt-5">
          <AccountNav />
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </RequireAuth>
  );
}