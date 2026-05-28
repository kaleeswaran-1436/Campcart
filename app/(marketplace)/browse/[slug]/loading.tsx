import { Skeleton } from "@/components/ui/Skeleton";

export default function ListingDetailLoading() {
  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-8 px-4 sm:px-0 animate-pulse">
      <Skeleton className="hidden sm:block h-5 w-32" />

      <div className="flex flex-col md:flex-row gap-6 lg:gap-10">
        {/* Left Column Skeleton */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <Skeleton className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-square w-full rounded-2xl" />
          <div className="flex gap-2">
            <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl" />
            <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="w-full md:w-[360px] lg:w-[400px] shrink-0 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-40 mt-2" />
          </div>

          <div className="flex flex-col gap-3 hidden sm:flex">
             <Skeleton className="h-12 w-full rounded-lg" />
             <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
