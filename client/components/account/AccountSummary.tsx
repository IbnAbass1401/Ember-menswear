"use client";

import { useAuth } from "@/store/auth";
import ProfileForm from "@/components/account/ProfileForm";
import PasswordForm from "@/components/account/PasswordForm";

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
    <div className="max-w-md space-y-6">
      <section className="rounded-2xl border border-cream/10 bg-surface p-5">
        <h2 className="font-display text-xl font-semibold">Profile</h2>
        <div className="mt-5">
          <ProfileForm />
        </div>
      </section>

      <section className="rounded-2xl border border-cream/10 bg-surface p-5">
        <h2 className="font-display text-xl font-semibold">Change password</h2>
        <div className="mt-5">
          <PasswordForm />
        </div>
      </section>

      <button
        type="button"
        onClick={onLogout}
        className="h-12 w-full rounded-xl border border-cream/20 font-medium transition hover:border-ember hover:text-ember"
      >
        Log out
      </button>
    </div>
  );
}