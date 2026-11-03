import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { getProducts, CATEGORIES } from "@/lib/api";

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

type Params = Promise<Record<string, string | string[] | undefined>>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ShopPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const category = CATEGORIES.find((c) => c === first(sp.category));
  const search = first(sp.search)?.trim() || undefined;
  const sort = SORTS.find((s) => s.value === first(sp.sort))?.value ?? "newest";
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const data = await getProducts({ category, search, sort, page: String(page), limit: "12" });

  const href = (over: Record<string, string | undefined>) => {
    const merged: Record<string, string | undefined> = {
      category,
      search,
      sort: sort === "newest" ? undefined : sort,
      ...over,
    };
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(merged)) if (v) qs.set(k, v);
    const s = qs.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  const chip = (active: boolean) =>
    `flex min-h-11 shrink-0 items-center rounded-full border px-5 transition ${
      active
        ? "border-ember bg-ember font-bold text-noir shadow-glow"
        : "border-ember/30 text-cream/70 hover:border-ember hover:text-cream"
    }`;

  const pageBtn = "flex min-h-11 items-center rounded-xl border border-ember/40 px-5 text-ember transition hover:bg-ember/15";

  // Empty state: what to say and where to send the customer
  const hasFilters = Boolean(category || search);
  const pastLastPage = data.products.length === 0 && page > 1 && data.total > 0;
  let emptyTitle = "No products yet";
  let emptyText = "New pieces are on the way. Check back soon.";
  let emptyAction: { href: string; label: string } | null = null;
  if (pastLastPage) {
    emptyTitle = "That page is empty";
    emptyText = "There's nothing on this page. Head back to the first one.";
    emptyAction = { href: href({ page: undefined }), label: "Go to page 1" };
  } else if (hasFilters) {
    emptyTitle = search ? `Nothing found for "${search}"` : `No ${category} available right now`;
    emptyText = "Try a different search or category.";
    emptyAction = { href: "/shop", label: "Clear filters" };
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">The collection</h1>
        <p className="mt-1 text-cream/60">
          {data.total} {data.total === 1 ? "product" : "products"}
        </p>
      </div>

      <form action="/shop" className="flex gap-2">
        {category && <input type="hidden" name="category" value={category} />}
        {sort !== "newest" && <input type="hidden" name="sort" value={sort} />}
        <input
          name="search"
          defaultValue={search}
          placeholder="Search products"
          className="min-h-11 flex-1 rounded-xl border border-ember/20 bg-surface px-4 text-cream outline-none transition placeholder:text-cream/40 focus:border-ember focus:shadow-glow"
        />
        <button className="min-h-11 rounded-xl bg-ember px-5 font-bold text-noir transition hover:shadow-glow-lg">
          Search
        </button>
      </form>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={href({ category: undefined })} className={chip(!category)}>
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link key={c} href={href({ category: c })} className={chip(category === c)}>
            {c}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
        {SORTS.map((s) => (
          <Link
            key={s.value}
            href={href({ sort: s.value === "newest" ? undefined : s.value })}
            className={`py-2 ${sort === s.value ? "font-bold text-ember" : "text-cream/60 hover:text-cream"}`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {data.products.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border border-ember/10 bg-surface/40 px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-ember/10 text-ember">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </div>
          <h2 className="mt-5 max-w-full break-words font-display text-xl font-semibold">{emptyTitle}</h2>
          <p className="mt-2 max-w-sm text-sm text-cream/60">{emptyText}</p>
          {emptyAction && (
            <Link
              href={emptyAction.href}
              className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-ember px-7 font-bold text-noir transition hover:shadow-glow-lg"
            >
              {emptyAction.label}
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {data.products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

      {data.pages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4">
          {page > 1 ? (
            <Link href={href({ page: String(page - 1) })} className={pageBtn}>
              ← Prev
            </Link>
          ) : (
            <span className={`${pageBtn} opacity-30`}>← Prev</span>
          )}
          <span className="text-sm text-cream/60">
            Page {page} of {data.pages}
          </span>
          {page < data.pages ? (
            <Link href={href({ page: String(page + 1) })} className={pageBtn}>
              Next →
            </Link>
          ) : (
            <span className={`${pageBtn} opacity-30`}>Next →</span>
          )}
        </nav>
      )}
    </div>
  );
}