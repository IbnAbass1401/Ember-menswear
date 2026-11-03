import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, formatPrice } from "@/lib/api";
import AddToCart from "@/components/product/AddToCart";
import ProductGallery from "@/components/product/ProductGallery";
import { SITE_NAME, SITE_URL, absoluteUrl, ogImage } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };

  const description = (product.description || `${product.name} at Ember Menswear.`)
    .replace(/\s+/g, " ")
    .slice(0, 155);
  const image = ogImage(product.images?.[0]);
  const path = `/product/${slug}`;

  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: product.name,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  // Structured data so Google can show price and stock in results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    category: product.category,
    brand: { "@type": "Brand", name: SITE_NAME },
    ...(product.images?.length ? { image: product.images.map(absoluteUrl) } : {}),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${slug}`,
      priceCurrency: "USD",
      price: product.price.toFixed(2),
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <Link href="/shop" className="inline-flex min-h-11 items-center text-sm text-cream/60 transition hover:text-ember">
        ← Back to shop
      </Link>

      <div className="mt-2 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={product.images ?? []} alt={product.name} />

        <div>
          <p className="text-sm text-cream/50">{product.category}</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-2xl font-bold text-ember">{formatPrice(product.price)}</p>
          {product.description && <p className="mt-5 max-w-prose text-cream/75">{product.description}</p>}

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <ul className="mt-8 space-y-1 border-t border-ember/15 pt-5 text-sm text-cream/60">
            <li>Free delivery over $120</li>
            <li>7-day easy returns</li>
          </ul>
        </div>
      </div>
    </div>
  );
}