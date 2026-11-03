import type { ReactNode } from "react";

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-5 w-5",
};

const TRUST: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: "Free delivery over $120",
    text: "Otherwise a flat $8",
    icon: (
      <svg {...iconProps}>
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: "7-day easy returns",
    text: "Doesn't fit? Send it back",
    icon: (
      <svg {...iconProps}>
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    title: "Secure checkout",
    text: "Pay safely with Paystack",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

// Each group repeats the 3 messages so it is wider than any screen.
// The track holds two identical groups and slides by exactly one group (-50%),
// which makes the loop seamless.
const REPEATS = 3;

function Group({ hideWhenStatic = false }: { hideWhenStatic?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-8 ${
        hideWhenStatic ? "motion-reduce:hidden" : ""
      }`}
    >
      {Array.from({ length: REPEATS }).map((_, r) =>
        TRUST.map((item) => (
          <div
            key={`${r}-${item.title}`}
            className={`flex shrink-0 items-center ${r > 0 ? "motion-reduce:hidden" : ""}`}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ember/10 text-ember">
              {item.icon}
            </span>
            <span className="ml-3 whitespace-nowrap">
              <span className="block text-sm font-semibold">{item.title}</span>
              <span className="block text-xs text-cream/60">{item.text}</span>
            </span>
            <span
              aria-hidden="true"
              className="mx-8 h-1.5 w-1.5 shrink-0 rotate-45 bg-ember/40 motion-reduce:hidden sm:mx-12"
            />
          </div>
        ))
      )}
    </div>
  );
}

export default function TrustMarquee() {
  const fade = "linear-gradient(to right, transparent, black 8%, black 92%, transparent)";

  return (
    <section aria-label="Why shop with us" className="border-y border-ember/10 bg-surface/40">
      <style>{`@keyframes ember-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>

      {/* Screen readers get the three messages once; the moving copies are hidden from them */}
      <ul className="sr-only">
        {TRUST.map((item) => (
          <li key={item.title}>
            {item.title}. {item.text}
          </li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="overflow-hidden py-3 sm:py-4"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <div className="flex w-max animate-[ember-marquee_20s_linear_infinite] will-change-transform hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:justify-center">
          <Group />
          <Group hideWhenStatic />
        </div>
      </div>
    </section>
  );
}