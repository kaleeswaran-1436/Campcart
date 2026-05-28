import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { TrendingUp } from "lucide-react";
import type { ListingCategory, ProductCondition } from "@/types/enums";
import { ListingCard } from "@/components/ui/ListingCard";

interface SectionListing {
  id: string;
  slug: string | null;
  title: string;
  price: number;
  originalPrice: number | null;
  category: string;
  condition: string;
  status: string;
  imageUrl: string | null;
  imageUrls: string[];
  createdAt: Date;
  seller: {
    id: string;
    name: string;
    avatar: string | null;
    isVerified: boolean;
  };
}

interface ListingsSectionProps {
  listings: SectionListing[];
}

export function ListingsSection({ listings }: ListingsSectionProps) {
  if (listings.length === 0) {
    return (
      <section className="py-12 bg-[var(--cc-bg)]">
        <Container>
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-xl font-bold text-[var(--cc-text-primary)] mb-2">Marketplace is warming up!</h2>
            <p className="text-sm text-[var(--cc-text-secondary)] mb-6">
              Be the first to list something on CampCart.
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--cc-primary)] text-white font-semibold text-sm hover:bg-[var(--cc-primary-hover)] transition-colors"
            >
              List Your First Item
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 bg-[var(--cc-bg)]">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D4A64F]/15">
              <TrendingUp className="h-4 w-4 text-[#D4A64F]" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[var(--cc-text-primary)] leading-tight">Fresh Listings</h2>
              <p className="text-xs text-[var(--cc-text-secondary)]">Just posted on campus</p>
            </div>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--cc-border)] text-sm font-medium text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)] hover:border-[var(--cc-border-strong)] transition-all duration-150"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={{
                id: listing.id,
                slug: listing.slug || listing.id,
                title: listing.title,
                price: listing.price,
                originalPrice: listing.originalPrice ?? undefined,
                category: listing.category as ListingCategory,
                condition: listing.condition as ProductCondition,
                status: listing.status as "ACTIVE" | "SOLD" | "RESERVED" | "EXPIRED" | "DRAFT" | "REMOVED",
                images: (() => {
                  const urls = listing.imageUrls?.length ? listing.imageUrls : (listing.imageUrl ? [listing.imageUrl] : []);
                  return urls.map((url, idx) => ({ id: String(idx), url, alt: listing.title, isPrimary: idx === 0 }));
                })(),
                seller: {
                  id: listing.seller.id,
                  name: listing.seller.name,
                  isVerified: listing.seller.isVerified,
                  rating: 4.5,
                },
                saves: 0,
                createdAt: listing.createdAt instanceof Date
                  ? listing.createdAt.toISOString()
                  : String(listing.createdAt),
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
