"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/Field";
import { useAuth } from "@/store/auth";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const status = useAuth((s) => s.status);
  const init = useAuth((s) => s.init);
  const login = useAuth((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  // Once logged in (or already logged in), go where they were headed
  useEffect(() => {
    if (status === "authed") router.replace(next);
  }, [status, next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "Enter a valid email.";
    if (!password) errs.password = "Enter your password.";
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      await login(email.trim(), password);
      // redirect happens in the effect above
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Login failed. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-cream/70">Log in to check out faster and track your orders.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
        {formError && (
          <div
            role="alert"
            className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {formError}
          </div>
        )}

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-xl bg-ember font-semibold text-noir transition hover:shadow-glow active:scale-[0.99] disabled:opacity-60"
        >
          {busy ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-cream/70">
        New to Ember?{" "}
        <Link
          href={`/register?next=${encodeURIComponent(next)}`}
          className="inline-flex min-h-11 items-center font-medium text-ember hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}