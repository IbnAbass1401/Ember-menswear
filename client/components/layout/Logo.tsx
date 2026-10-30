import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-extrabold tracking-wide">
      <svg viewBox="0 0 24 24" className="h-8 w-8 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" aria-hidden="true">
        <defs>
          <linearGradient id="ember-flame" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#B45309" />
            <stop offset="1" stopColor="#FBBF24" />
          </linearGradient>
        </defs>
        <path
          d="M12 1.5c.8 4.2 5.8 6.2 5.8 11.6a5.8 5.8 0 0 1-11.6 0c0-2.2 1.1-3.8 2.3-5 .3 1.7 1.1 2.7 2.2 2.9-.9-3.3 0-6.4 1.3-9.5z"
          fill="url(#ember-flame)"
        />
        <path
          d="M12 12.2c.4 1.5 2.1 2.2 2.1 4a2.1 2.1 0 0 1-4.2 0c0-1.3.9-1.9 1.4-2.7.4.5.7.6.7.6z"
          fill="#FFF8E7"
          opacity=".9"
        />
      </svg>
      EMBER
    </Link>
  );
}