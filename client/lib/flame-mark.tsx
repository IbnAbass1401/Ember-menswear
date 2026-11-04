// The Ember flame, used to build the site icons. Not shown on the pages themselves.
export default function FlameMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#B45309" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.62" r="0.55">
          <stop offset="0" stopColor="#FBBF24" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FBBF24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14" fill="#0E0904" />
      <rect width="64" height="64" rx="14" fill="url(#glow)" />
      <path
        d="M32 4 C34 16 50 24 50 40 C50 52 42 60 32 60 C22 60 14 52 14 40 C14 31 19 26 24 20 C25 26 28 28 30 28 C28 20 29 12 32 4 Z"
        fill="url(#flame)"
      />
      <path
        d="M32 32 C33 38 40 41 40 48 C40 53 36 56 32 56 C28 56 24 53 24 48 C24 43 28 41 30 36 C31 38 31 36 32 32 Z"
        fill="#FFF8E7"
      />
    </svg>
  );
}