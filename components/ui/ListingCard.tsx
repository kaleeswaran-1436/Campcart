import Link from "next/link";
import { Clock, ShieldCheck, Heart } from "lucide-react";
import { OptimizedImage } from "@/components/ui/Image";
import { ListingStatus, ProductCondition, type ListingCategory } from "@/types/enums";
import type { ListingPreview } from "@/types/listing";
import { APP_ROUTES } from "@/constants/routes";
import { useMarketplaceStore } from "@/store/marketplace-store";
import { cn } from "@/utils/cn";

// Utility to format relative time (e.g., "2h ago")
function getRelativeTime(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

// Category format helper
function formatCategory(category: ListingCategory) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Condition map for compact UI
const CONDITION_MAP: Record<ProductCondition, { label: string; className: string }> = {
  [ProductCondition.NEW]: { label: "New", className: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  [ProductCondition.LIKE_NEW]: { label: "Like New", className: "text-blue-600 bg-blue-50 border-blue-200" },
  [ProductCondition.GOOD]: { label: "Good", className: "text-[var(--cc-text-secondary)] bg-[var(--cc-surface-alt)] border-[var(--cc-border)]" },
  [ProductCondition.FAIR]: { label: "Fair", className: "text-amber-600 bg-amber-50 border-amber-200" },
  [ProductCondition.POOR]: { label: "Poor", className: "text-red-600 bg-red-50 border-red-200" },
};

interface ListingCardProps {
  listing: ListingPreview;
  className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const { toggleSaved, isSaved } = useMarketplaceStore();
  const saved = isSaved(listing.id);

  const primaryImage = listing.images.find((img) => img.isPrimary) || listing.images[0];
  const conditionObj = CONDITION_MAP[listing.condition] || CONDITION_MAP[ProductCondition.GOOD];

  const isSold = listing.status === ListingStatus.SOLD;
  const isReserved = listing.status === ListingStatus.RESERVED;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-xl border border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[var(--cc-border)]",
        (isSold || isReserved) && "opacity-80 hover:opacity-100",
        className
      )}
    >
      {/* ── Image Wrapper ────────────────────────────────────── */}
      <Link href={APP_ROUTES.listing(listing.slug)} className="relative block aspect-[4/3] bg-[var(--cc-surface-alt)] overflow-hidden">
        {primaryImage && (
          <OptimizedImage
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            aspectRatio="listing"
            className={cn(
              "group-hover:scale-105 transition-transform duration-300",
              isSold && "grayscale"
            )}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
          <span className="rounded-md bg-white/90 backdrop-blur-sm px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--cc-text-primary)] shadow-sm">
            {formatCategory(listing.category)}
          </span>
          {isReserved && (
            <span className="rounded-md bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
              RESERVED
            </span>
          )}
          {isSold && (
            <span className="rounded-md bg-gray-800 text-white px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
              SOLD
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaved(listing.id);
          }}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          aria-label={saved ? "Remove from saved" : "Save listing"}
        >
          <Heart
            className={cn("h-4 w-4 transition-colors", saved ? "fill-red-500 text-red-500" : "text-gray-600")}
          />
        </button>
      </Link>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3">
        {/* Price & Condition */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-lg font-bold text-[var(--cc-text-primary)] leading-none">
              ₹{listing.price}
            </span>
            {listing.originalPrice && (
              <span className="text-xs text-[var(--cc-text-disabled)] line-through">
                ₹{listing.originalPrice}
              </span>
            )}
          </div>
          <span
            className={cn(
              "shrink-0 rounded text-[10px] font-semibold px-1.5 py-0.5 border",
              conditionObj.className
            )}
          >
            {conditionObj.label}
          </span>
        </div>

        {/* Title */}
        <Link
          href={APP_ROUTES.listing(listing.slug)}
          className="text-sm font-medium text-[var(--cc-text-primary)] line-clamp-2 leading-snug mb-auto group-hover:text-[var(--cc-primary)] transition-colors"
          title={listing.title}
        >
          {listing.title}
        </Link>

        {/* Footer info (Seller / Time) */}
        <div className="mt-3 flex items-center justify-between text-xs text-[var(--cc-text-secondary)]">
          <div className="flex items-center gap-1 min-w-0">
            <span className="truncate max-w-[100px]">{listing.seller.name}</span>
            {listing.seller.isVerified && (
              <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3" />
            <span>{getRelativeTime(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
