import Link from "next/link";
import { getProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default async function Home() {
  const { products } = await getProducts({ featured: "true", limit: "4" });

  return (
    <>
      {/* HERO: put your photo at client/public/hero.jpg */}
      <section
        className="relative flex min-h-[70svh] items-center overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/hero.jpg'), radial-gradient(circle at 75% 40%, rgba(251,191,36,.28), #0E0904 65%)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-noir/70 to-noir/90 md:bg-linear-to-r md:from-noir/90 md:via-noir/60 md:to-noir/20" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-noir to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h1 className="max-w-xl font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-7xl">
            Dress sharp. Own the room.
          </h1>
          <p className="mt-4 max-w-md text-base text-cream/75 sm:text-lg">
            Shirts, denim, jackets, shoes and the small things that finish a look. Picked to fit well and last.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-ember px-7 font-bold text-noir transition hover:-translate-y-0.5 hover:shadow-glow-lg"
          >
            Shop the collection
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Featured</h2>
          <Link href="/shop" className="text-sm text-ember hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}