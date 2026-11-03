import Skeleton from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div role="status" aria-busy="true" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      <span className="sr-only">Loading product...</span>

      <div className="flex min-h-11 items-center">
        <Skeleton className="h-4 w-28" />
      </div>

      <div className="mt-2 grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* photo + thumbnails */}
        <div>
          <Skeleton className="aspect-4/5 w-full rounded-2xl" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-16 shrink-0" />
            ))}
          </div>
        </div>

        {/* details */}
        <div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-3 h-9 w-4/5" />
          <Skeleton className="mt-4 h-7 w-24" />
          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="mt-8 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-14" />
            ))}
          </div>
          <Skeleton className="mt-4 h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}