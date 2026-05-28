import { Skeleton } from "@/components/ui/Skeleton";

export function ChatListSkeleton() {
  return (
    <div className="flex flex-col w-full divide-y divide-[var(--cc-border-subtle)]">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 w-full">
          <Skeleton className="h-14 w-14 rounded-lg shrink-0" />
          <div className="flex flex-col gap-2 w-full overflow-hidden">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChatRoomSkeleton() {
  return (
    <div className="flex flex-col h-[100dvh] bg-[var(--cc-bg)] overflow-hidden">
      {/* Header Skeleton */}
      <div className="h-14 border-b border-[var(--cc-border)] flex items-center px-4 gap-3 shrink-0">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* Listing Context Skeleton */}
      <div className="p-3 border-b border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] flex items-center gap-3 shrink-0">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex flex-col gap-1.5 flex-1">
          <Skeleton className="h-3.5 w-40" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden justify-end">
        <div className="flex w-full justify-start">
          <Skeleton className="h-16 w-64 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex w-full justify-end">
          <Skeleton className="h-12 w-48 rounded-2xl rounded-br-sm" />
        </div>
        <div className="flex w-full justify-start">
          <Skeleton className="h-12 w-56 rounded-2xl rounded-bl-sm" />
        </div>
      </div>

      {/* Input Skeleton */}
      <div className="p-3 border-t border-[var(--cc-border)] shrink-0 pb-[env(safe-area-inset-bottom,12px)]">
        <div className="flex gap-2 items-center">
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          <Skeleton className="h-11 flex-1 rounded-2xl" />
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
        </div>
      </div>
    </div>
  );
}
