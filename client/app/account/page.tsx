import type { Metadata } from "next";
import RequireAuth from "@/components/auth/RequireAuth";
import AccountSummary from "@/components/account/AccountSummary";

export const metadata: Metadata = { title: "My account | Ember" };

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountSummary />
    </RequireAuth>
  );
}