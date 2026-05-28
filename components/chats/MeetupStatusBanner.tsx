"use client";

import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import type { ConversationStage } from "@/types/chat";
import { cn } from "@/utils/cn";

interface MeetupStatusBannerProps {
  stage: ConversationStage;
  meetupTitle?: string;
  meetupTime?: string;
  onActionClick?: () => void;
  className?: string;
}

const STAGE_CONFIG: Partial<Record<ConversationStage, {
  bg: string;
  border: string;
  textColor: string;
  icon: React.ReactNode;
  label: string;
  actionLabel?: string;
}>> = {
  RESERVED: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    textColor: "text-amber-600",
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "Item Reserved — Schedule a meetup to complete the exchange",
    actionLabel: "Set Meetup",
  },
  MEETUP_PLANNED: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    textColor: "text-blue-600",
    icon: <MapPin className="h-3.5 w-3.5" />,
    label: "Meetup Planned",
    actionLabel: "Generate QR",
  },
  COMPLETED: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    textColor: "text-emerald-600",
    icon: <Calendar className="h-3.5 w-3.5" />,
    label: "Exchange Completed",
  },
};

export function MeetupStatusBanner({
  stage,
  meetupTitle,
  meetupTime,
  onActionClick,
  className,
}: MeetupStatusBannerProps) {
  const config = STAGE_CONFIG[stage];
  if (!config) return null;

  return (
    <button
      onClick={config.actionLabel ? onActionClick : undefined}
      disabled={!config.actionLabel}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-2.5 border-b",
        config.bg,
        config.border,
        "border-t-0 border-l-0 border-r-0",
        config.actionLabel && "hover:opacity-90 transition-opacity cursor-pointer",
        "text-left",
        className
      )}
    >
      <span className={config.textColor}>{config.icon}</span>

      <div className="flex-1 min-w-0">
        <p className={cn("text-xs font-semibold", config.textColor)}>{config.label}</p>
        {meetupTitle && (
          <p className="text-xs text-[var(--cc-text-secondary)] truncate">
            📍 {meetupTitle}
            {meetupTime && (
              <span className="ml-1 font-medium">
                · {format(new Date(meetupTime), "MMM d, h:mm a")}
              </span>
            )}
          </p>
        )}
      </div>

      {config.actionLabel && (
        <span className={cn("flex items-center gap-0.5 text-xs font-semibold shrink-0", config.textColor)}>
          {config.actionLabel}
          <ChevronRight className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}
