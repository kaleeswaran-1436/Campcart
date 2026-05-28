import { Skeleton } from "@/components/ui/Skeleton";

function ChatRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--cc-border-subtle)]">
      <Skeleton height="h-10" width="w-10" rounded="full" />
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex justify-between">
          <Skeleton height="h-3.5" width="w-28" />
          <Skeleton height="h-3" width="w-10" />
        </div>
        <Skeleton height="h-3" width="w-48" />
      </div>
    </div>
  );
}

function ChatBubbleSkeleton({ align }: { align: "left" | "right" }) {
  return (
    <div
      className={`flex gap-2 ${align === "right" ? "flex-row-reverse" : "flex-row"}`}
    >
      {align === "left" && <Skeleton height="h-8" width="w-8" rounded="full" />}
      <div className="flex flex-col gap-1 max-w-[60%]">
        <Skeleton
          height="h-10"
          className="w-full"
          rounded="lg"
        />
        <Skeleton height="h-2.5" width="w-12" className={align === "right" ? "ml-auto" : ""} />
      </div>
    </div>
  );
}

/**
 * Skeleton for the chat conversation list panel.
 */
export function ChatListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div aria-label="Loading conversations…">
      <div className="px-4 py-3 border-b border-[var(--cc-border-subtle)]">
        <Skeleton height="h-8" width="w-full" rounded="lg" />
      </div>
      {Array.from({ length: count }).map((_, i) => (
        <ChatRowSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for the message thread panel.
 */
export function ChatThreadSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <ChatBubbleSkeleton align="left" />
      <ChatBubbleSkeleton align="right" />
      <ChatBubbleSkeleton align="left" />
      <ChatBubbleSkeleton align="right" />
      <ChatBubbleSkeleton align="left" />
    </div>
  );
}
