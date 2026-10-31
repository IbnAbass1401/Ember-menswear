"use client";

import { FormEvent, useState } from "react";
import Field from "@/components/ui/Field";
import { apiRequest } from "@/lib/client-api";

type Errors = Partial<Record<"current" | "next" | "confirm", string>>;

export default function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    const errs: Errors = {};
    if (!current) errs.current = "Enter your current password.";
    if (next.length < 8) errs.next = "New password must be at least 8 characters.";
    else if (next === current) errs.next = "New password must be different from the current one.";
    if (confirm !== next) errs.confirm = "Passwords don't match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      await apiRequest(
        "/users/me/password",
        { currentPassword: current, newPassword: next },
        "PATCH"
      );
      setCurrent("");
      setNext("");
      setConfirm("");
      setSuccess("Password updated.");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Couldn't update your password. Try again.");
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
        label="Current password"
        type="password"
        value={current}
        onChange={setCurrent}
        error={errors.current}
        autoComplete="current-password"
      />
      <Field
        label="New password"
        type="password"
        value={next}
        onChange={setNext}
        error={errors.next}
        autoComplete="new-password"
        placeholder="At least 8 characters"
      />
      <Field
        label="Confirm new password"
        type="password"
        value={confirm}
        onChange={setConfirm}
        error={errors.confirm}
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={busy}
        className="h-12 w-full rounded-xl border border-ember/60 font-semibold text-ember transition hover:bg-ember hover:text-noir active:scale-[0.99] disabled:opacity-60"
      >
        {busy ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}