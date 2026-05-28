/**
 * Listing DTO Types
 * Shared between API and frontend - single source of truth
 */

import type { Listing as PrismaListing, User as PrismaUser } from "@prisma/client";

/**
 * Seller profile embedded in listing responses
 */
export interface SellerDTO {
  id: string;
  name: string;
  email?: string;
  avatar: string | null;
  isVerified: boolean;
  createdAt?: string;
}

/**
 * Minimal listing for grid/list views
 * Used in marketplace feed, search results, user dashboard
 */
export interface ListingCardDTO {
  id: string;
  slug: string;
  title: string;
  price: number;
  originalPrice: number | null;
  category: string;
  condition: string;
  status: string;
  imageUrl: string | null;
  imageUrls: string[];
  seller: SellerDTO;
  createdAt: string;
}

/**
 * Full listing detail for single listing page
 * Includes all metadata and related data
 */
export interface ListingDetailDTO extends ListingCardDTO {
  description: string;
  negotiable: boolean;
  tags: string[];
  department: string | null;
  updatedAt: string;
}

/**
 * Listing creation request payload
 * Validated by listingSchema
 */
export interface ListingCreateRequest {
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  category: string;
  condition: string;
  negotiable?: boolean;
  tags?: string[];
  department?: string;
  imageUrls: string[];
}

/**
 * API Response wrapper
 */
export interface ListingApiResponse<T> {
  success?: boolean;
  listing?: T;
  listings?: T[];
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Convert Prisma Listing model to DTO
 */
export function toPrismaListing(
  listing: PrismaListing & { seller: PrismaUser }
): ListingDetailDTO {
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    description: listing.description,
    price: listing.price,
    originalPrice: listing.originalPrice,
    category: listing.category,
    condition: listing.condition,
    status: listing.status,
    imageUrl: listing.imageUrl,
    imageUrls: listing.imageUrls,
    negotiable: listing.negotiable,
    tags: listing.tags,
    department: listing.department,
    createdAt: listing.createdAt.toISOString(),
    updatedAt: listing.updatedAt.toISOString(),
    seller: {
      id: listing.seller.id,
      name: listing.seller.name,
      avatar: listing.seller.avatar,
      isVerified: listing.seller.isVerified,
    },
  };
}

/**
 * Convert Prisma Listing to card view
 */
export function toListingCardDTO(
  listing: PrismaListing & { seller: PrismaUser }
): ListingCardDTO {
  return {
    id: listing.id,
    slug: listing.slug,
    title: listing.title,
    price: listing.price,
    originalPrice: listing.originalPrice,
    category: listing.category,
    condition: listing.condition,
    status: listing.status,
    imageUrl: listing.imageUrl,
    imageUrls: listing.imageUrls,
    createdAt: listing.createdAt.toISOString(),
    seller: {
      id: listing.seller.id,
      name: listing.seller.name,
      avatar: listing.seller.avatar,
      isVerified: listing.seller.isVerified,
    },
  };
}
