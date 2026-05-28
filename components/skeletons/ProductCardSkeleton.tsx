import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton for a single marketplace product card.
 */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--cc-border-subtle)] bg-[var(--cc-surface)]">
      {/* Image */}
      <Skeleton className="aspect-square w-full" rounded="sm" />
      <div className="p-3 flex flex-col gap-2">
        {/* Badge */}
        <Skeleton height="h-4" width="w-12" rounded="full" />
        {/* Title */}
        <Skeleton height="h-3.5" width="w-full" />
        <Skeleton height="h-3.5" width="w-3/4" />
        {/* Price */}
        <div className="flex items-center gap-2 mt-1">
          <Skeleton height="h-4" width="w-14" />
          <Skeleton height="h-3" width="w-10" />
        </div>
      </div>
    </div>
  );
}

/**
 * A responsive grid of ProductCardSkeletons.
 */
export function FeedSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid-marketplace" aria-label="Loading listings…">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
