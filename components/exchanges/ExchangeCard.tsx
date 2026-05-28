import Link from "next/link";
import { formatDistanceToNow, format, isPast } from "date-fns";
import {
  QrCode, CheckCircle2, Clock, XCircle,
  ArrowRight, MapPin, ArrowRightLeft, ShieldCheck,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ExchangeStatus } from "@/types/enums";
import type { MOCK_EXCHANGES } from "@/lib/mock/exchanges";
import { APP_ROUTES } from "@/constants/routes";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

type Exchange = (typeof MOCK_EXCHANGES)[number];

interface ExchangeCardProps {
  exchange: Exchange;
}

/* ── Status config ──────────────────────────────────────────── */
const STATUS_CONFIG = {
  [ExchangeStatus.PENDING]: {
    label: "Pending",
    color: "text-[var(--cc-text-secondary)]",
    bg: "bg-[var(--cc-bg-muted)]",
    border: "border-[var(--cc-border-subtle)]",
    icon: Clock,
    dot: "status-dot--muted",
  },
  [ExchangeStatus.CONFIRMED]: {
    label: "Confirmed",
    color: "text-[var(--cc-info)]",
    bg: "bg-[var(--cc-info-subtle)]",
    border: "border-[var(--cc-info-border)]",
    icon: CheckCircle2,
    dot: "status-dot--info",
  },
  [ExchangeStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "text-[var(--cc-warning)]",
    bg: "bg-[var(--cc-warning-subtle)]",
    border: "border-[var(--cc-warning-border)]",
    icon: ArrowRightLeft,
    dot: "status-dot--warning",
  },
  [ExchangeStatus.COMPLETED]: {
    label: "Completed",
    color: "text-[var(--cc-success)]",
    bg: "bg-[var(--cc-success-subtle)]",
    border: "border-[var(--cc-success-border)]",
    icon: CheckCircle2,
    dot: "status-dot--success",
  },
  [ExchangeStatus.CANCELLED]: {
    label: "Cancelled",
    color: "text-[var(--cc-error)]",
    bg: "bg-[var(--cc-error-subtle)]",
    border: "border-[var(--cc-error-border)]",
    icon: XCircle,
    dot: "status-dot--error",
  },
  [ExchangeStatus.DISPUTED]: {
    label: "Disputed",
    color: "text-[var(--cc-error)]",
    bg: "bg-[var(--cc-error-subtle)]",
    border: "border-[var(--cc-error-border)]",
    icon: XCircle,
    dot: "status-dot--error",
  },
} satisfies Record<string, { label: string; color: string; bg: string; border: string; icon: typeof Clock; dot: string }>;

export function ExchangeCard({ exchange }: ExchangeCardProps) {
  const cfg = STATUS_CONFIG[exchange.status] ?? STATUS_CONFIG[ExchangeStatus.PENDING]!;
  const StatusIcon = cfg.icon;
  const isActive =
    exchange.status === ExchangeStatus.IN_PROGRESS ||
    exchange.status === ExchangeStatus.CONFIRMED;

  const meetupPast =
    exchange.scheduledAt && isPast(new Date(exchange.scheduledAt));

  return (
    <div
      className={cn(
        "surface flex flex-col sm:flex-row gap-4 p-4 transition-all",
        isActive && "ring-1 ring-[var(--cc-primary)]/30"
      )}
    >
      {/* Image */}
      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden shrink-0 bg-[var(--cc-bg-muted)]">
        <img
          src={exchange.listingImageUrl}
          alt={exchange.listingTitle}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            {/* Status pill */}
            <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium mb-2", cfg.bg, cfg.color)}>
              <span className={cn("status-dot", cfg.dot)} />
              {cfg.label}
            </div>

            {/* Title */}
            <p className="text-sm font-semibold text-[var(--cc-text-primary)] leading-tight line-clamp-1">
              {exchange.listingTitle}
            </p>

            {/* Role + price */}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                exchange.isBuyer
                  ? "bg-[var(--cc-info-subtle)] text-[var(--cc-info)]"
                  : "bg-[var(--cc-primary-subtle)] text-[var(--cc-primary)]"
              )}>
                {exchange.isBuyer ? "Buying" : "Selling"}
              </span>
              <span className="text-sm font-bold text-[var(--cc-primary)]">
                ₹{exchange.listingPrice}
              </span>
            </div>
          </div>

          {/* QR icon for active */}
          {isActive && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--cc-primary-subtle)] text-[var(--cc-primary)] shrink-0">
              <QrCode className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
          {/* Other party */}
          <div className="flex items-center gap-1.5">
            <img
              src={`https://i.pravatar.cc/32?u=${exchange.otherParty.id}`}
              alt={exchange.otherParty.name}
              className="h-4 w-4 rounded-full"
            />
            <span className="text-xs text-[var(--cc-text-secondary)]">
              {exchange.isBuyer ? "Seller:" : "Buyer:"}{" "}
              <strong className="text-[var(--cc-text-primary)]">
                {exchange.otherParty.name}
              </strong>
            </span>
            {exchange.otherParty.isVerified && (
              <ShieldCheck className="h-3 w-3 text-[var(--cc-success)]" />
            )}
          </div>

          {/* Meetup location */}
          {exchange.meetupLocation && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[var(--cc-text-disabled)]" />
              <span className="text-xs text-[var(--cc-text-secondary)]">
                {exchange.meetupLocation}
              </span>
            </div>
          )}

          {/* Scheduled time */}
          {exchange.scheduledAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-[var(--cc-text-disabled)]" />
              <span className={cn(
                "text-xs",
                meetupPast
                  ? "text-[var(--cc-error)]"
                  : isActive
                  ? "text-[var(--cc-warning)] font-medium"
                  : "text-[var(--cc-text-secondary)]"
              )}>
                {isActive
                  ? `Meetup ${formatDistanceToNow(new Date(exchange.scheduledAt), { addSuffix: true })}`
                  : format(new Date(exchange.scheduledAt), "dd MMM yyyy")}
              </span>
            </div>
          )}

          {/* Completed time */}
          {exchange.completedAt && (
            <span className="text-xs text-[var(--cc-text-disabled)]">
              Completed {formatDistanceToNow(new Date(exchange.completedAt), { addSuffix: true })}
            </span>
          )}

          {/* Cancelled reason */}
          {exchange.status === ExchangeStatus.CANCELLED && exchange.cancellationReason && (
            <span className="text-xs text-[var(--cc-error)]">
              {exchange.cancellationReason}
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      {isActive && (
        <div className="sm:self-center shrink-0">
          <Link
            href={APP_ROUTES.chats}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--cc-primary)] text-white text-sm font-medium hover:bg-[var(--cc-primary-hover)] transition-colors"
          >
            Open Chat
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
