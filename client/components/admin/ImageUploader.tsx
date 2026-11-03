"use client";

import { ChangeEvent, useState } from "react";
import Photo from "@/components/ui/Photo";
import {
  IMAGE_TYPES,
  MAX_IMAGES,
  MAX_IMAGE_BYTES,
  uploadProductImages,
} from "@/lib/admin-products";
import { shrinkImage } from "@/lib/image-resize";

type Props = {
  value: string[];
  onChange: (images: string[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
};

// Photos picked from a phone or camera can be big; they're shrunk before upload.
// This only stops absurdly large files from being loaded into the browser.
const MAX_PICKED_BYTES = 30 * 1024 * 1024;

const iconBtn =
  "grid h-11 flex-1 place-items-center rounded-lg border border-cream/15 bg-surface text-base text-cream transition-colors hover:border-ember disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-cream/15";

export default function ImageUploader({ value, onChange, onUploadingChange }: Props) {
  const [phase, setPhase] = useState<"idle" | "preparing" | "uploading">("idle");
  const [error, setError] = useState("");
  const busy = phase !== "idle";
  const remaining = MAX_IMAGES - value.length;

  async function handlePick(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // lets the same file be picked again later
    if (files.length === 0) return;
    setError("");

    if (files.length > remaining) {
      setError(
        remaining === 0
          ? `You already have ${MAX_IMAGES} photos. Remove one to add another.`
          : `You can add ${remaining} more photo${remaining === 1 ? "" : "s"} (max ${MAX_IMAGES} per product).`
      );
      return;
    }
    if (files.some((f) => !IMAGE_TYPES.includes(f.type))) {
      setError("Only JPG, PNG or WEBP photos are allowed.");
      return;
    }
    if (files.some((f) => f.size > MAX_PICKED_BYTES)) {
      setError("One of those photos is too big (over 30MB). Pick a smaller one.");
      return;
    }

    onUploadingChange?.(true);
    try {
      setPhase("preparing");
      let prepared: File[];
      try {
        prepared = await Promise.all(files.map((f) => shrinkImage(f, MAX_IMAGE_BYTES)));
      } catch {
        setError("Couldn't read one of those photos. Try a different file.");
        return;
      }

      if (prepared.some((f) => f.size > MAX_IMAGE_BYTES)) {
        setError("One photo is still too large after shrinking. Try a smaller one.");
        return;
      }

      setPhase("uploading");
      const urls = await uploadProductImages(prepared);
      onChange([...value, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setPhase("idle");
      onUploadingChange?.(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, i) => (
            <li key={url} className="rounded-xl border border-cream/10 bg-surface/60 p-2">
              <div className="relative overflow-hidden rounded-lg">
                <Photo src={url} alt={`Product photo ${i + 1}`} className="aspect-4/5 w-full" />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-ember px-2.5 py-1 text-xs font-semibold text-noir">
                    Main
                  </span>
                )}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={busy || i === 0}
                  aria-label={`Move photo ${i + 1} earlier`}
                  className={iconBtn}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={busy || i === value.length - 1}
                  aria-label={`Move photo ${i + 1} later`}
                  className={iconBtn}
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  disabled={busy}
                  aria-label={`Remove photo ${i + 1}`}
                  className={`${iconBtn} hover:border-red-400 hover:text-red-300`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input
        id="p-photos"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handlePick}
        disabled={busy || remaining === 0}
        className="peer sr-only"
      />
      <label
        htmlFor="p-photos"
        className="flex h-12 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-ember/50 text-sm font-medium text-ember transition-colors hover:bg-ember/10 peer-focus-visible:ring-2 peer-focus-visible:ring-ember peer-disabled:cursor-not-allowed peer-disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {phase === "preparing"
          ? "Preparing photos..."
          : phase === "uploading"
            ? "Uploading..."
            : value.length === 0
              ? "Add photos"
              : remaining === 0
                ? "Photo limit reached"
                : "Add more photos"}
      </label>

      <div aria-live="polite">
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}