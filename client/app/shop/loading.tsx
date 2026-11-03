import Skeleton from "@/components/ui/Skeleton";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";

// Mirrors app/shop/page.tsx: heading, search, chips, sort links, grid
export default function ShopLoading() {
  return (
    <div role="status" aria-busy="true" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <span className="sr-only">Loading products...</span>

      <div className="mb-6">
        <Skeleton className="h-9 w-56 sm:h-10" />
        <Skeleton className="mt-3 h-4 w-24" />
      </div>

      {/* search */}
      <div className="flex gap-2">
        <Skeleton className="h-11 flex-1 rounded-xl" />
        <Skeleton className="h-11 w-24 rounded-xl" />
      </div>

      {/* category chips */}
      <div className="-mx-4 mt-5 flex gap-2 overflow-hidden px-4 sm:mx-0 sm:px-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-24 shrink-0 rounded-full" />
        ))}
      </div>

      {/* sort links */}
      <div className="mt-4 flex gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="my-2.5 h-4 w-24" />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}