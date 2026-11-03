import Skeleton from "@/components/ui/Skeleton";

// Same shape as ProductCard so the page doesn't jump when real cards load
export default function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ember/10 bg-surface">
      <Skeleton className="aspect-4/5 w-full rounded-none" />
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <Skeleton className="mt-4 h-5 w-14" />
      </div>
    </div>
  );
}