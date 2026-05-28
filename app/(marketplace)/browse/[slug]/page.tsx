import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ImageGallery } from "@/components/marketplace/detail/ImageGallery";
import { ListingInfo } from "@/components/marketplace/detail/ListingInfo";
import { SellerCard } from "@/components/marketplace/detail/SellerCard";
import { TransactionActions } from "@/components/marketplace/detail/TransactionActions";
import { RelatedListings } from "@/components/marketplace/detail/RelatedListings";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";
import type { ListingCategory, ProductCondition } from "@/types/enums";

export default async function ListingDetailPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  try {
    // Fetch the listing from database - try by slug first, then by ID
    let listing = await prisma.listing.findUnique({
      where: { slug },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    // Fallback: try to find by ID in case slug is actually an ID
    if (!listing) {
      listing = await prisma.listing.findUnique({
        where: { id: slug },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
              isVerified: true,
              createdAt: true,
            },
          },
        },
      });
    }

    if (!listing || listing.deletedAt) {
      return notFound();
    }

    // Fetch related listings (same category, exclude current)
    const relatedListings = await prisma.listing.findMany({
      where: {
        category: listing.category,
        id: { not: listing.id },
        deletedAt: null,
        status: "ACTIVE",
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
      take: 6,
    });

    return (
      <div className="flex flex-col gap-6 pb-24 md:pb-8">
        {/* Back Button (Desktop) */}
        <div className="hidden sm:block px-4 sm:px-0">
          <Link
            href={APP_ROUTES.browse}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 px-4 sm:px-0">
          {/* Left Column: Image Gallery & Related (Desktop) */}
          <div className="flex-1 flex flex-col gap-8 min-w-0">
            <ImageGallery
              images={listing.imageUrls && listing.imageUrls.length > 0 
                ? listing.imageUrls.map((url, idx) => ({
                    id: `${idx}`,
                    url,
                    alt: listing.title,
                    isPrimary: idx === 0,
                  }))
                : listing.imageUrl ? [{ id: "1", url: listing.imageUrl, alt: listing.title, isPrimary: true }] : []}
              status={listing.status}
              title={listing.title}
            />
            
            <div className="hidden md:block border-t border-[var(--cc-border-subtle)] pt-8 mt-4">
              <RelatedListings
                listings={relatedListings.map((l) => ({
                  id: l.id,
                  slug: l.slug,
                  title: l.title,
                  price: l.price,
                  originalPrice: l.originalPrice || undefined,
                  category: l.category as ListingCategory,
                  condition: l.condition as ProductCondition,
                  status: l.status,
                  images: l.imageUrls && l.imageUrls.length > 0 
                    ? l.imageUrls.map((url, idx) => ({
                        id: `${idx}`,
                        url,
                        alt: l.title,
                        isPrimary: idx === 0,
                      }))
                    : l.imageUrl ? [{ id: "1", url: l.imageUrl, alt: l.title, isPrimary: true }] : [],
                  seller: {
                    ...l.seller,
                    rating: 4.5,
                  },
                  views: 0,
                  saves: 0,
                  createdAt: l.createdAt.toISOString(),
                  updatedAt: l.updatedAt.toISOString(),
                }))}
              />
            </div>
          </div>

          {/* Right Column: Listing Info & Transaction Panel */}
          <div className="w-full md:w-[360px] lg:w-[400px] shrink-0 flex flex-col gap-8">
            <ListingInfo
              title={listing.title}
              price={listing.price}
              originalPrice={listing.originalPrice ?? undefined}
              condition={listing.condition as ProductCondition}
              category={listing.category as ListingCategory}
              department={listing.department || ""}
              campus=""
              createdAt={listing.createdAt.toISOString()}
              description={listing.description}
            />

            {/* Desktop Transaction Panel */}
            <div className="hidden sm:flex flex-col gap-4">
              <TransactionActions
                listingId={listing.id}
                status={listing.status}
                sellerName={listing.seller.name}
              />
            </div>

            <SellerCard
              seller={{
                id: listing.seller.id,
                name: listing.seller.name,
                avatar: listing.seller.avatar ?? undefined,
                isVerified: listing.seller.isVerified,
                rating: 4.5,
                totalSales: 0,
                college: "",
              }}
            />

            {/* Mobile Related Listings */}
            <div className="md:hidden border-t border-[var(--cc-border-subtle)] pt-8 mt-4">
              <RelatedListings
                listings={relatedListings.map((l) => ({
                  id: l.id,
                  slug: l.slug,
                  title: l.title,
                  price: l.price,
                  originalPrice: l.originalPrice || undefined,
                  category: l.category as ListingCategory,
                  condition: l.condition as ProductCondition,
                  status: l.status,
                  images: l.imageUrls && l.imageUrls.length > 0 
                    ? l.imageUrls.map((url, idx) => ({
                        id: `${idx}`,
                        url,
                        alt: l.title,
                        isPrimary: idx === 0,
                      }))
                    : l.imageUrl ? [{ id: "1", url: l.imageUrl, alt: l.title, isPrimary: true }] : [],
                  seller: {
                    ...l.seller,
                    rating: 4.5,
                  },
                  views: 0,
                  saves: 0,
                  createdAt: l.createdAt.toISOString(),
                  updatedAt: l.updatedAt.toISOString(),
                }))}
              />
            </div>
          </div>
        </div>

        {/* Mobile Sticky Bottom Transaction Bar */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--cc-surface)]/95 backdrop-blur-md border-t border-[var(--cc-border-subtle)] p-4 pb-safe flex gap-3 shadow-lg">
          <div className="flex-1 flex gap-3 max-w-lg mx-auto w-full">
            <TransactionActions
              listingId={listing.id}
              status={listing.status}
              sellerName={listing.seller.name}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching listing:", error);
    return notFound();
  }
}
