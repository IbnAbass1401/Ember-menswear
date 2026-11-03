/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { ReactNode } from "react";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

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

export default async function Home() {
  const { products } = await getProducts({ featured: "true", limit: "4" });

  return (
    <>
      {/* HERO: hero-mobile.jpg (2:3) on phones, hero.jpg (3:2) from tablet up. Both in client/public */}
      <section
        className="relative flex aspect-2/3 items-end overflow-hidden md:aspect-16/9 md:max-h-[900px] md:min-h-[70svh] md:items-center"
        style={{
          backgroundImage: "radial-gradient(circle at 75% 40%, rgba(251,191,36,.28), #0E0904 65%)",
        }}
      >
        <picture>
          <source media="(min-width: 768px)" srcSet="/hero.jpg" />
          <img
            src="/hero-mobile.jpg"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </picture>

        {/* Mobile: light on top (face stays clear), strong at the bottom behind the text */}
        <div className="absolute inset-0 bg-linear-to-b from-noir/10 via-noir/30 to-noir/95 md:bg-linear-to-r md:from-noir/90 md:via-noir/60 md:to-noir/20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-noir to-transparent" />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-16">
          <h1 className="max-w-xl font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
            Dress sharp. Own the room.
          </h1>
          <p className="mt-4 max-w-md text-base text-cream/75 sm:text-lg">
            Shirts, denim, jackets, shoes and the small things that finish a look. Picked to fit well and last.
          </p>

          <div className="mt-6 flex gap-3 sm:mt-8">
            <Link
              href="/shop"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-ember px-4 text-center font-bold text-noir transition hover:-translate-y-0.5 hover:shadow-glow-lg sm:flex-none sm:px-7"
            >
              Shop now
            </Link>
            <Link