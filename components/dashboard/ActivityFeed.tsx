import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Package, MessageCircle, ArrowRightLeft,
  CheckCircle2, Clock, AlertCircle,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_ROUTES } from "@/constants/routes";

export interface ActivityItem {
  id: string;
  type: "listing_created" | "listing_sold" | "message_received" | "exchange_started" | "exchange_completed" | "listing_reserved";
  title: string;
  description: string;
  timestamp: string;
  href?: string;
}

const ACTIVITY_ICON_MAP: Record<
  ActivityItem["type"],
  { icon: typeof Package; iconColor: string; iconBg: string }
> = {
  listing_created:    { icon: Package,         iconColor: "text-[var(--cc-info)]",    iconBg: "bg-[var(--cc-info-subtle)]"    },
  listing_sold:       { icon: CheckCircle2,    iconColor: "text-[var(--cc-success)]", iconBg: "bg-[var(--cc-success-subtle)]" },
  listing_reserved:   { icon: Clock,           iconColor: "text-[var(--cc-warning)]", iconBg: "bg-[var(--cc-warning-subtle)]" },
  message_received:   { icon: MessageCircle,   iconColor: "text-[var(--cc-primary)]", iconBg: "bg-[var(--cc-primary-subtle)]" },
  exchange_started:   { icon: ArrowRightLeft,  iconColor: "text-[var(--cc-info)]",    iconBg: "bg-[var(--cc-info-subtle)]"    },
  exchange_completed: { icon: CheckCircle2,    iconColor: "text-[var(--cc-success)]", iconBg: "bg-[var(--cc-success-subtle)]" },
};

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
}

export function ActivityFeed({ items, className }: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-10 text-center", className)}>
        <AlertCircle className="h-8 w-8 text-[var(--cc-text-disabled)] mb-3" />
        <p className="text-sm font-medium text-[var(--cc-text-secondary)]">No recent activity</p>
        <p className="text-xs text-[var(--cc-text-disabled)] mt-1">
          Start listing items to see activity here
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col divide-y divide-[var(--cc-border-subtle)]", className)}>
      {items.map((item) => {
        const { icon: Icon, iconColor, iconBg } = ACTIVITY_ICON_MAP[item.type];
        const content = (
          <>
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-0.5", iconBg)}>
              <Icon className={cn("h-3.5 w-3.5", iconColor)} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--cc-text-primary)] truncate">{item.title}</p>
              <p className="text-xs text-[var(--cc-text-secondary)] mt-0.5">{item.description}</p>
            </div>
            <time className="text-[10px] text-[var(--cc-text-disabled)] shrink-0 mt-0.5">
              {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
            </time>
          </>
        );

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-start gap-3 py-3 px-1 rounded-lg hover:bg-[var(--cc-bg-muted)] transition-colors cursor-pointer"
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={item.id}
            className="flex items-start gap-3 py-3 px-1 rounded-lg"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
