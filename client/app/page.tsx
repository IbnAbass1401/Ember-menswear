/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import TrustMarquee from "@/components/home/TrustMarquee";

export default async function Home() {
  const { products } = await getProducts({ featured: "true", limit: "4" });

  return (
    <>
      {/* HERO: hero-mobile.jpg (2:3) on phones, hero.jpg (3:2) from tablet up. Both in client/public */}
      <section
        className="relative flex aspect-2/3 items-end overflow-hidden md:aspect-video md:max-h-225 md:min-h-[70svh] md:items-center"
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
              href="/shop?category=Outerwear"
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-cream/30 px-4 text-center font-semibold text-cream transition hover:border-ember hover:text-ember sm:flex-none sm:px-7"
            >
              Shop outerwear
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STRIP (slow sliding ticker) */}
      <TrustMarquee />

      {/* FEATURED (hidden if nothing is marked featured) */}
      {products.length > 0 && (
        <section id="featured" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Featured</h2>
            <Link
              href="/shop"
              className="inline-flex min-h-11 items-center text-sm text-ember hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}