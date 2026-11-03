"use client";

import { useRef, useState, type UIEvent } from "react";
import Photo from "@/components/ui/Photo";

type Props = { images: string[]; alt: string };

export default function ProductGallery({ images, alt }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // No photos yet: show the placeholder as a single slide
  const slides: (string | undefined)[] = images.length > 0 ? images : [undefined];
  const multiple = slides.length > 1;

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== active) setActive(index);
  }

  function goTo(index: number) {
    const el = trackRef.current;
    if (!el) return;
    setActive(index);
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-ember/10 blur-3xl" />

      {/* Swipe on phones (scroll-snap), no sideways page scroll */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="relative flex snap-x snap-mandatory overflow-x-auto rounded-2xl border border-ember/15 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((src, i) => (
          <div key={src ?? "placeholder"} className="w-full shrink-0 snap-center">
            <Photo
              src={src}
              alt={multiple ? `${alt} (photo ${i + 1} of ${slides.length})` : alt}
              label
              priority={i === 0}
              sizes="(min-width: 1024px) 560px, 100vw"
              className="aspect-4/5 w-full"
            />
          </div>
        ))}
      </div>

      {multiple && (
        <ul className="relative mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
          {slides.map((src, i) => (
            <li key={src ?? "placeholder"} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active}
                className={`block h-20 w-16 overflow-hidden rounded-lg border-2 transition ${
                  i === active
                    ? "border-ember shadow-glow"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Photo src={src} alt="" sizes="64px" className="h-full w-full" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}