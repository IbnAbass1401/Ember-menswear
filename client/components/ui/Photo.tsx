/* eslint-disable @next/next/no-img-element */
type Props = {
  src?: string;
  alt: string;
  className?: string;
  label?: boolean;
  // How wide the image is shown, e.g. "(min-width: 1024px) 280px, 50vw".
  // When set, a responsive srcSet is used (Cloudinary photos only).
  sizes?: string;
  // Load immediately instead of lazily (for the main photo at the top of a page)
  priority?: boolean;
};

const UPLOAD = "/image/upload/";
const WIDTHS = [160, 320, 480, 640, 800, 1200, 1600];

function isCloudinary(src: string) {
  return src.startsWith("https://res.cloudinary.com/") && src.includes(UPLOAD);
}

// Asks Cloudinary for a smaller, optimized copy (auto format + auto quality)
function withWidth(src: string, width: number) {
  return src.replace(UPLOAD, `${UPLOAD}f_auto,q_auto,c_limit,w_${width}/`);
}

export default function Photo({
  src,
  alt,
  className = "",
  label = false,
  sizes,
  priority = false,
}: Props) {
  if (!src) {
    return (
      <div
        className={`grid place-items-center bg-linear-to-br from-[#3a2810] to-[#1a1208] px-3 text-center text-xs text-ember/40 ${className}`}
      >
        {label ? "Product photo goes here" : ""}
      </div>
    );
  }

  const optimized = isCloudinary(src);
  const imgSrc = optimized ? withWidth(src, 800) : src;
  const srcSet =
    optimized && sizes ? WIDTHS.map((w) => `${withWidth(src, w)} ${w}w`).join(", ") : undefined;

  return (
    <img
      src={imgSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={`object-cover ${className}`}
    />
  );
}