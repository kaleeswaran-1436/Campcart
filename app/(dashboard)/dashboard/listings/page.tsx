"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Package, Plus, Eye, Pencil, Trash2, CheckCircle2,
  Clock, XCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { useNotificationStore } from "@/store/notification-store";

interface Listing {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: string;
  condition: string;
  status: string;
  imageUrl: string | null;
  imageUrls: string[];
  createdAt: string;
}

type FilterTab = "all" | "active" | "reserved" | "sold" | "draft";

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeVariant: "mint" | "used" | "new" | "verified"; icon: typeof Package }
> = {
  ACTIVE: { label: "Active", badgeVariant: "new", icon: CheckCircle2 },
  RESERVED: { label: "Reserved", badgeVariant: "mint", icon: Clock },
  SOLD: { label: "Sold", badgeVariant: "verified", icon: CheckCircle2 },
  DRAFT: { label: "Draft", badgeVariant: "used", icon: Package },
  EXPIRED: { label: "Expired", badgeVariant: "used", icon: XCircle },
  REMOVED: { label: "Removed", badgeVariant: "used", icon: XCircle },
};

export default function DashboardListingsPage() {
  const { toast } = useNotificationStore();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch listings on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/listings/user", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setListings(data.listings || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load listings";
        toast.error("Error", message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [toast]);

  const filtered = listings.filter((l) => {
    if (activeTab === "all") return true;
    return l.status === activeTab.toUpperCase();
  });

  const handleDelete = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      setIsDeleting(listingId);
      const response = await fetch("/api/listings/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      setListings((prev) => prev.filter((l) => l.id !== listingId));
      toast.success("Listing deleted", "Your listing has been removed");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete listing";
      toast.error("Error", message);
    } finally {
      setIsDeleting(null);
    }
  };

  const statusCounts = {
    all: listings.length,
    active: listings.filter((l) => l.status === "ACTIVE").length,
    reserved: listings.filter((l) => l.status === "RESERVED").length,
    sold: listings.filter((l) => l.status === "SOLD").length,
  };

  const TABS = [
    { key: "all" as FilterTab, label: "All", count: statusCounts.all },
    { key: "active" as FilterTab, label: "Active", count: statusCounts.active },
    { key: "reserved" as FilterTab, label: "Reserved", count: statusCounts.reserved },
    { key: "sold" as FilterTab, label: "Sold", count: statusCounts.sold },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--cc-primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--cc-text-primary)]">My Listings</h1>
          <p className="text-sm text-[var(--cc-text-secondary)] mt-0.5">
            {statusCounts.all} item{statusCounts.all !== 1 ? "s" : ""} posted
          </p>
        </div>
        <Button href={APP_ROUTES.sell} variant="primary" size="sm" className="gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          New Listing
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--cc-border-subtle)] overflow-x-auto no-scrollbar">
        {TABS.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
              activeTab === key
                ? "border-[var(--cc-primary)] text-[var(--cc-primary)]"
                : "border-transparent text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)]"
            )}
          >
            {label}
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full font-medium",
                activeTab === key
                  ? "bg-[var(--cc-primary-subtle)] text-[var(--cc-primary)]"
                  : "bg-[var(--cc-bg-muted)] text-[var(--cc-text-secondary)]"
              )}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="surface flex flex-col items-center justify-center py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--cc-bg-muted)] mb-4">
            <Package className="h-7 w-7 text-[var(--cc-text-disabled)]" />
          </span>
          <p className="font-semibold text-[var(--cc-text-primary)]">No listings here</p>
          <p className="text-sm text-[var(--cc-text-secondary)] mt-1 mb-4">
            {activeTab === "all"
              ? "You haven't posted anything yet."
              : `No ${activeTab} listings.`}
          </p>
          <Button href={APP_ROUTES.sell} variant="primary" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Post an Item
          </Button>
        </div>
      ) : (
        /* Listings table */
        <div className="surface overflow-hidden">
          {/* Desktop header */}
          <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-4 px-5 py-3 border-b border-[var(--cc-border-subtle)] bg-[var(--cc-bg-muted)]">
            <div className="w-12" />
            <p className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wide">Item</p>
            <p className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wide w-20 text-center">Price</p>
            <p className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wide w-24 text-center">Status</p>
            <p className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wide w-24 text-right">Actions</p>
          </div>

          <div className="divide-y divide-[var(--cc-border-subtle)]">
            {filtered.map((listing) => {
              const statusCfg = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG["ACTIVE"]!;
              const createdAgo = formatDistanceToNow(new Date(listing.createdAt), {
                addSuffix: true,
              });
              const listingImage = listing.imageUrls?.[0] || listing.imageUrl;

              return (
                <div
                  key={listing.id}
                  className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto] items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-[var(--cc-bg-muted)]/50 transition-colors"
                >
                  {/* Image */}
                  <div className="hidden sm:block w-12 h-12 rounded-lg overflow-hidden bg-[var(--cc-bg-muted)] shrink-0">
                    {listingImage && (
                      <img
                        src={listingImage}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Mobile layout */}
                  <div className="flex sm:hidden items-center gap-3">
                    <div className="h-12 w-12 rounded-lg overflow-hidden bg-[var(--cc-bg-muted)] shrink-0">
                      {listingImage && (
                        <img
                          src={listingImage}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[var(--cc-text-primary)] truncate">
                        {listing.title}
                      </p>
                      <p className="text-xs text-[var(--cc-text-secondary)] mt-0.5">
                        ₹{listing.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Title (desktop) */}
                  <div className="hidden sm:block min-w-0">
                    <Link
                      href={`${APP_ROUTES.browse}/${listing.slug}`}
                      className="font-medium text-[var(--cc-text-primary)] hover:text-[var(--cc-primary)] truncate block"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-xs text-[var(--cc-text-secondary)] mt-1">
                      {createdAgo}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="hidden sm:block text-center w-20">
                    <p className="font-semibold text-[var(--cc-text-primary)]">
                      ₹{listing.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:block w-24">
                    <Badge variant={statusCfg.badgeVariant} className="justify-center w-full">
                      {statusCfg.label}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:justify-end gap-2">
                    <Link
                      href={`${APP_ROUTES.browse}/${listing.slug}`}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--cc-bg-muted)] text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`${APP_ROUTES.sell}?edit=${listing.id}`}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--cc-bg-muted)] text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleDelete(listing.id)}
                      disabled={isDeleting === listing.id}
                      className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[var(--cc-bg-muted)] text-[var(--cc-text-secondary)] hover:text-red-500 disabled:opacity-50 transition-colors"
                      title="Delete"
                    >
                      {isDeleting === listing.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
