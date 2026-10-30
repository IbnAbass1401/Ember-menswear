/* eslint-disable @next/next/no-img-element */
type Props = { src?: string; alt: string; className?: string; label?: boolean };

export default function Photo({ src, alt, className = "", label = false }: Props) {
  if (!src) {
    return (
      <div
        className={`grid place-items-center bg-linear-to-br from-[#3a2810] to-[#1a1208] px-3 text-center text-xs text-ember/40 ${className}`}
      >
        {label ? "Product photo goes here" : ""}
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}