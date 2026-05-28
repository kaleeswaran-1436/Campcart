import { Skeleton } from "@/components/ui/Skeleton";

export function ListingCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full rounded-none" />

      {/* Content skeleton */}
      <div className="flex flex-col flex-1 p-3">
        {/* Price & Condition */}
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Title */}
        <Skeleton className="h-4 w-full mb-1.5" />
        <Skeleton className="h-4 w-2/3 mb-auto" />

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}
