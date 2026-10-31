"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Field from "@/components/ui/Field";
import { useAuth } from "@/store/auth";

export default function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const status = useAuth((s) => s.status);
  const init = useAuth((s) => s.init);
  const register = useAuth((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (status === "authed") router.replace(next);
  }, [status, next, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "Enter your name (at least 2 characters).";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) errs.email = "Enter a valid email.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Sign up failed. Try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-16">
      <h1 className="font-display text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-cream/70">Takes a minute. Free delivery over $120.</p>

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
          label="Full name"
          value={name}
          onChange={setName}
          error={errors.name}
          autoComplete="name"
          placeholder="Your name"
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
        />

        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-xl bg-ember font-semibold text-noir transition hover:shadow-glow active:scale-[0.99] disabled:opacity-60"
        >
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-cream/70">
        Already have an account?{" "}
        <Link
          href={`/login?next=${encodeURIComponent(next)}`}
          className="inline-flex min-h-11 items-center font-medium text-ember hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}