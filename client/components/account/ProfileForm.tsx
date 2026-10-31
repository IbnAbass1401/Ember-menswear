"use client";

import { FormEvent, useState } from "react";
import Field from "@/components/ui/Field";
import { useAuth, type User } from "@/store/auth";
import { apiRequest } from "@/lib/client-api";

export default function ProfileForm() {
  const user = useAuth((s) => s.user);
  const setUser = useAuth((s) => s.setUser);

  const [name, setName] = useState(user?.name ?? "");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setFieldError("Enter your name (at least 2 characters).");
      return;
    }
    setFieldError("");

    if (trimmed === user?.name) {
      setSuccess("That's already your name.");
      return;
    }

    setBusy(true);
    try {
      const data = await apiRequest<{ user: User }>("/users/me", { name: trimmed }, "PATCH");
      setUser(data.user);
      setName(data.user.name);
      setSuccess("Saved.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't save. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {formError && (
        <div
          role="alert"
          className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {formError}
        </div>
      )}
      {success && (
        <div
          role="status"
          className="rounded-xl border border-ember/30 bg-ember/10 px-4 py-3 text-sm"
        >
          {success}
        </div>
      )}

      <Field
        label="Full name"
        value={name}
        onChange={setName}
        error={fieldError}
        autoComplete="name"
      />

      <div>
        <p className="mb-1.5 text-sm font-medium text-cream/80">Email</p>
        <p className="break-all rounded-xl border border-cream/10 px-4 py-3 text-cream/70">
          {user.email}
        </p>
        <p className="mt-1.5 text-xs text-cream/50">Your email can&rsquo;t be changed here.</p>
      </div>

      <button
        type="submit"
        disabled={busy}
        className="h-12 w-full rounded-xl bg-ember font-semibold text-noir transition hover:shadow-glow active:scale-[0.99] disabled:opacity-60"
      >
        {busy ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}