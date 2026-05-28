import { ListingCard } from "@/components/ui/ListingCard";
import type { ListingPreview } from "@/types/listing";

interface RelatedListingsProps {
  listings: ListingPreview[];
}

export function RelatedListings({ listings }: RelatedListingsProps) {
  if (!listings || listings.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-[var(--cc-text-primary)]">Similar Items</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {listings.slice(0, 4).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
