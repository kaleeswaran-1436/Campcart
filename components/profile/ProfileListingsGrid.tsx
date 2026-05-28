"use client";

import { ListingCard } from "@/components/ui/ListingCard";
import type { ListingPreview } from "@/types/listing";

interface ProfileListingsGridProps {
  listings: ListingPreview[];
}

/** Thin client wrapper so ListingCard (which uses useMarketplaceStore) can run in a server page. */
export function ProfileListingsGrid({ listings }: ProfileListingsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
