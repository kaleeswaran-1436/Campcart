import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Skeleton for a user profile page / seller card.
 */
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Avatar + name block */}
      <div className="flex items-center gap-3">
        <Skeleton height="h-14" width="w-14" rounded="full" />
        <div className="flex flex-col gap-1.5">
          <Skeleton height="h-4" width="w-32" />
          <Skeleton height="h-3" width="w-24" />
          <Skeleton height="h-3" width="w-20" />
        </div>
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="surface p-3 flex flex-col items-center gap-1">
            <Skeleton height="h-5" width="w-8" />
            <Skeleton height="h-3" width="w-14" />
          </div>
        ))}
      </div>
      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <Skeleton height="h-3.5" width="w-full" />
        <Skeleton height="h-3.5" width="w-5/6" />
        <Skeleton height="h-3.5" width="w-4/6" />
      </div>
      {/* Listings grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton height="h-3" width="w-full" />
            <Skeleton height="h-4" width="w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
