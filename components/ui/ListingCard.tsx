"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Clock, ShieldCheck, Heart, Eye, Tag } from "lucide-react";
import { OptimizedImage } from "@/components/ui/Image";
import { ListingStatus, ProductCondition, type ListingCategory } from "@/types/enums";
import type { ListingPreview } from "@/types/listing";
import { APP_ROUTES } from "@/constants/routes";
import { useMarketplaceStore } from "@/store/marketplace-store";
import { cn } from "@/utils/cn";

function getRelativeTime(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d`;
  if (hrs  > 0) return `${hrs}h`;
  if (mins > 0) return `${mins}m`;
  return "Now";
}

function getDiscount(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round((1 - price / originalPrice) * 100);
}

const CONDITION_STYLES: Record<ProductCondition, { label: string; className: string }> = {
  [ProductCondition.NEW]:      { label: "New",      className: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" },
  [ProductCondition.LIKE_NEW]: { label: "Like New", className: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800" },
  [ProductCondition.GOOD]:     { label: "Good",     className: "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800" },
  [ProductCondition.FAIR]:     { label: "Fair",     className: "text-orange-700 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800" },
  [ProductCondition.POOR]:     { label: "Poor",     className: "text-red-700 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800" },
};

interface ListingCardProps {
  listing: ListingPreview;
  className?: string;
}

export function ListingCard({ listing, className }: ListingCardProps) {
  const { toggleSaved, isSaved } = useMarketplaceStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving,  setIsSaving]  = useState(false);

  const saved        = isSaved(listing.id);
  const primaryImage = listing.images.find((img) => img.isPrimary) || listing.images[0];
  const condition    = CONDITION_STYLES[listing.condition] ?? CONDITION_STYLES[ProductCondition.GOOD];
  const isSold       = listing.status === ListingStatus.SOLD;
  const isReserved   = listing.status === ListingStatus.RESERVED;
  const discount     = getDiscount(listing.price, listing.originalPrice);
  const href         = APP_ROUTES.listing(listing.slug);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaving(true);
    toggleSaved(listing.id);
    setTimeout(() => setIsSaving(false), 600);
  };

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] overflow-hidden",
        "shadow-[var(--cc-shadow-card)] hover:shadow-[var(--cc-shadow-card-hover)]",
        "hover:border-[var(--cc-border)] transition-shadow duration-200",
        (isSold || isReserved) && "opacity-75",
        className
      )}
    >
      {/* ── Image ──────────────────────────────────────────────── */}
      <Link href={href} className="relative block aspect-[4/3] bg-[var(--cc-surface-alt)] overflow-hidden">
        {primaryImage ? (
          <OptimizedImage
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            aspectRatio="listing"
            className={cn(
              "transition-transform duration-400",
              isHovered && "scale-105",
              isSold && "grayscale"
            )}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Tag className="h-8 w-8 text-[var(--cc-border)]" />
          </div>
        )}

        {/* Overlay on hover */}
        <AnimatePresence>
          {isHovered && !isSold && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
            >
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-800"
              >
                <Eye className="h-3 w-3" />
                Quick View
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status / Discount badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {discount !== null && (
            <span className="rounded-lg bg-[#D4A64F] text-white px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
              -{discount}%
            </span>
          )}
          {isReserved && (
            <span className="rounded-lg bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
              RESERVED
            </span>
          )}
          {isSold && (
            <span className="rounded-lg bg-gray-800 text-white px-1.5 py-0.5 text-[10px] font-bold shadow-sm">
              SOLD
            </span>
          )}
        </div>

        {/* Time badge */}
        <div className="absolute top-2 right-10 flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-black/50 backdrop-blur-sm text-white text-[9px] font-medium">
          <Clock className="h-2.5 w-2.5" />
          {getRelativeTime(listing.createdAt)}
        </div>

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleSave}
          className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-colors z-10"
          aria-label={saved ? "Remove from saved" : "Save listing"}
        >
          <motion.div
            animate={isSaving ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.4 }}
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-colors duration-200",
                saved ? "fill-red-500 text-red-500" : "text-gray-500"
              )}
            />
          </motion.div>
        </motion.button>
      </Link>

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3">
        {/* Price row */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-base font-black text-[var(--cc-text-primary)] leading-none">
              ₹{listing.price.toLocaleString("en-IN")}
            </span>
            {listing.originalPrice && listing.originalPrice > listing.price && (
              <span className="text-xs text-[var(--cc-text-disabled)] line-through">
                ₹{listing.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          <span
            className={cn(
              "shrink-0 rounded-lg text-[9px] font-bold px-1.5 py-0.5 border",
              condition.className
            )}
          >
            {condition.label}
          </span>
        </div>

        {/* Title */}
        <Link
          href={href}
          className="text-xs font-semibold text-[var(--cc-text-primary)] line-clamp-2 leading-snug mb-auto group-hover:text-[var(--cc-primary)] transition-colors duration-150"
          title={listing.title}
        >
          {listing.title}
        </Link>

        {/* Seller row */}
        <div className="mt-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            {/* Avatar */}
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-[#D4A64F] to-[#C8943C] flex items-center justify-center text-white text-[8px] font-bold shrink-0">
              {listing.seller.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <span className="text-[10px] text-[var(--cc-text-secondary)] truncate max-w-[80px]">
              {listing.seller.name}
            </span>
            {listing.seller.isVerified && (
              <ShieldCheck className="h-3 w-3 text-emerald-500 shrink-0" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
