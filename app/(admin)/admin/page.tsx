import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--cc-text-primary)]">Admin Dashboard</h1>
        <p className="text-sm text-[var(--cc-text-secondary)] mt-1">Platform overview</p>
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="surface p-4 space-y-2">
            <Skeleton height="h-3" width="w-20" />
            <Skeleton height="h-7" width="w-14" />
            <Skeleton height="h-2.5" width="w-24" />
          </div>
        ))}
      </div>

      {/* Chart area skeleton */}
      <div className="surface p-4">
        <Skeleton height="h-3" width="w-32" className="mb-4" />
        <Skeleton height="h-48" width="w-full" />
      </div>
    </div>
  );
}
