"use client";

import { useId, useState } from "react";

type Props = {
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
};

export default function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}: Props) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-cream/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          autoCapitalize={type === "email" ? "none" : undefined}
          autoCorrect={type === "email" ? "off" : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-12 w-full rounded-xl border bg-surface px-4 text-base text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-ember ${
            error ? "border-red-400" : "border-cream/15"
          } ${isPassword ? "pr-20" : ""}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-1 top-1/2 flex h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-lg px-3 text-sm text-cream/70 hover:text-ember"
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}