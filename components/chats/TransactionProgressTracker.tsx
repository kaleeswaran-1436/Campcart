"use client";

import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import type { ConversationStage } from "@/types/chat";
import { cn } from "@/utils/cn";

const STAGES: { key: ConversationStage; label: string; shortLabel: string }[] = [
  { key: "NEGOTIATING", label: "Negotiating", shortLabel: "Chat" },
  { key: "RESERVED", label: "Reserved", shortLabel: "Reserved" },
  { key: "MEETUP_PLANNED", label: "Meetup Set", shortLabel: "Meetup" },
  { key: "COMPLETED", label: "Completed", shortLabel: "Done" },
];

const STAGE_ORDER: ConversationStage[] = [
  "NEGOTIATING",
  "RESERVED",
  "MEETUP_PLANNED",
  "COMPLETED",
];

interface TransactionProgressTrackerProps {
  stage: ConversationStage;
  className?: string;
}

export function TransactionProgressTracker({ stage, className }: TransactionProgressTrackerProps) {
  const currentIndex = STAGE_ORDER.indexOf(stage);

  return (
    <div className={cn("flex items-center gap-0 overflow-x-auto no-scrollbar px-4 py-2", className)}>
      {STAGES.map((s, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isUpcoming = i > currentIndex;
        const isLast = i === STAGES.length - 1;

        return (
          <div key={s.key} className="flex items-center shrink-0">
            {/* Step */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                  isCompleted && "bg-emerald-500 text-white",
                  isCurrent && "bg-[var(--cc-primary)] text-white ring-2 ring-[var(--cc-primary)]/30",
                  isUpcoming && "bg-[var(--cc-surface-alt)] text-[var(--cc-text-tertiary)] border border-[var(--cc-border)]"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Circle className={cn("h-2.5 w-2.5 fill-current", isCurrent && "fill-white", isUpcoming && "fill-transparent")} />
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium whitespace-nowrap",
                  isCompleted && "text-emerald-600",
                  isCurrent && "text-[var(--cc-primary)] font-semibold",
                  isUpcoming && "text-[var(--cc-text-tertiary)]"
                )}
              >
                {s.shortLabel}
              </span>
            </div>

            {/* Connector */}
            {!isLast && (
              <div className="flex items-center mx-1 mb-4">
                <div
                  className={cn(
                    "h-0.5 w-8 transition-colors",
                    i < currentIndex ? "bg-emerald-400" : "bg-[var(--cc-border)]"
                  )}
                />
                <ArrowRight
                  className={cn(
                    "h-3 w-3 -ml-1.5",
                    i < currentIndex ? "text-emerald-400" : "text-[var(--cc-border)]"
                  )}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
