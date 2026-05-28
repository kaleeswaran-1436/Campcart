"use client";

import { useMemo, useState, useEffect } from "react";
import { useMarketplaceStore } from "@/store/marketplace-store";
import { CategoryPills } from "@/components/marketplace/CategoryPills";
import { FilterDrawer } from "@/components/marketplace/FilterDrawer";
import { ListingCard } from "@/components/ui/ListingCard";
import { ListingCardSkeleton } from "@/components/skeletons/ListingCardSkeleton";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { SearchX } from "lucide-react";

interface Listing {
  id: string;
  title: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  category: string;
  condition: string;
  status: string;
  seller: {
    id: string;
    name: string;
    avatar?: string | null;
    isVerified: boolean;
  };
  createdAt: string;
}

export default function BrowsePage() {
  const { filters, activeCategory, searchQuery, resetFilters } = useMarketplaceStore();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);

  // Prevent hydration mismatch on Zustand
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("limit", "50");
        
        if (searchQuery) {
          params.set("search", searchQuery);
        }
        if (activeCategory && activeCategory !== "all") {
          params.set("category", activeCategory);
        }
        if (filters.condition) {
          params.set("condition", filters.condition);
        }

        const response = await fetch(`/api/listings?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }

        const data = await response.json();
        setListings(data.listings || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listings");
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search/filter changes
    const timer = setTimeout(fetchListings, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, activeCategory, filters]);

  // Filter the listings based on remaining filters
  const filteredListings = useMemo(() => {
    if (isLoading) return [];

    let result = [...listings];

    // Apply price filters
    if (filters.minPrice !== undefined) {
      result = result.filter((l) => l.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((l) => l.price <= filters.maxPrice!);
    }

    return result;
  }, [listings, filters.minPrice, filters.maxPrice, isLoading]);

  // Wait for client mount to render the grid (Zustand hydration safe)
  if (!mounted) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-14 border-b border-[var(--cc-border-subtle)]" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header: Categories and Mobile Filters */}
      <div className="flex items-center gap-3 w-full border-b border-[var(--cc-border-subtle)] pb-4 px-4 sm:px-0">
        <FilterDrawer />
        <div className="flex-1 overflow-hidden">
          <CategoryPills />
        </div>
      </div>

      <div className="px-4 sm:px-0">
        {/* Results Info */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-[var(--cc-text-primary)] tracking-tight">
            Campus Listings
          </h1>
          <p className="text-sm text-[var(--cc-text-secondary)]">
            Showing {filteredListings.length} {filteredListings.length === 1 ? "result" : "results"}
          </p>
        </div>

        {/* Grid or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Failed to load listings"
            description={error}
            icon={<SearchX className="h-10 w-10 text-[var(--cc-text-disabled)]" />}
            className="mt-8"
          />
        ) : filteredListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={{
                  id: listing.id,
                  slug: listing.id,
                  title: listing.title,
                  price: listing.price,
                  originalPrice: listing.originalPrice || undefined,
                  category: listing.category as any,
                  condition: listing.condition as any,
                  status: listing.status as any,
                  images: listing.imageUrl ? [{ id: "1", url: listing.imageUrl, alt: listing.title, isPrimary: true }] : [],
                  seller: {
                    id: listing.seller.id,
                    name: listing.seller.name,
                    isVerified: listing.seller.isVerified,
                    rating: 4.5,
                  },
                  saves: 0,
                  createdAt: listing.createdAt,
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No listings found"
            description="We couldn't find anything matching your filters or search query."
            icon={<SearchX className="h-10 w-10 text-[var(--cc-text-disabled)]" />}
            action={{
              label: "Clear all filters",
              onClick: resetFilters,
            }}
            className="mt-8"
          />
        )}
      </div>
    </div>
  );
}
