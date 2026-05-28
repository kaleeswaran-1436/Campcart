/**
 * Listing Mapper
 * 
 * Converts raw DTO types from Prisma/API to strongly-typed frontend types.
 * Validates enum values during conversion.
 */

import type { Listing, ListingPreview, ListingSeller } from "@/types/listing";
import type {
  ListingCategory,
  ListingStatus,
  ProductCondition,
} from "@/types/enums";
import {
  ListingStatus as ListingStatusEnum,
  ProductCondition as ProductConditionEnum,
  ListingCategory as ListingCategoryEnum,
} from "@/types/enums";
import type { ListingDTO, ListingPreviewDTO } from "@/types/dto/listing.dto";

/**
 * Validate and cast a string to a ListingCategory enum
 */
function validateCategory(value: string): ListingCategory {
  const validCategories = Object.values(ListingCategoryEnum);
  if (validCategories.includes(value as ListingCategory)) {
    return value as ListingCategory;
  }
  console.warn(`Invalid category: ${value}, defaulting to OTHER`);
  return ListingCategoryEnum.OTHER;
}

/**
 * Validate and cast a string to a ProductCondition enum
 */
function validateCondition(value: string): ProductCondition {
  const validConditions = Object.values(ProductConditionEnum);
  if (validConditions.includes(value as ProductCondition)) {
    return value as ProductCondition;
  }
  console.warn(`Invalid condition: ${value}, defaulting to GOOD`);
  return ProductConditionEnum.GOOD;
}

/**
 * Validate and cast a string to a ListingStatus enum
 */
function validateStatus(value: string): ListingStatus {
  const validStatuses = Object.values(ListingStatusEnum);
  if (validStatuses.includes(value as ListingStatus)) {
    return value as ListingStatus;
  }
  console.warn(`Invalid status: ${value}, defaulting to ACTIVE`);
  return ListingStatusEnum.ACTIVE;
}

/**
 * Map seller DTO to frontend type
 */
export function mapSellerDTO(seller: any): ListingSeller {
  return {
    id: seller.id,
    name: seller.name,
    avatar: seller.avatar || undefined,
    college: seller.college || "",
    rating: seller.rating || 0,
    totalSales: seller.totalSales || 0,
    isVerified: seller.isVerified || false,
  };
}

/**
 * Map listing DTO to strongly-typed Listing
 */
export function mapListingDTO(dto: ListingDTO): Listing {
  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    description: dto.description,
    price: dto.price,
    originalPrice: dto.originalPrice || undefined,
    category: validateCategory(dto.category),
    condition: validateCondition(dto.condition),
    status: validateStatus(dto.status),
    negotiable: dto.negotiable || false,
    department: dto.department || undefined,
    tags: dto.tags || [],
    views: 0, // Not stored in DB yet
    saves: 0, // Not stored in DB yet
    campus: "", // Not in current schema
    images: dto.imageUrl
      ? [
          {
            id: "1",
            url: dto.imageUrl,
            alt: dto.title,
            isPrimary: true,
          },
        ]
      : [],
    seller: dto.seller ? mapSellerDTO(dto.seller) : ({} as ListingSeller),
    createdAt: new Date(dto.createdAt).toISOString(),
    updatedAt: new Date(dto.updatedAt).toISOString(),
  };
}

/**
 * Map listing preview DTO to strongly-typed ListingPreview
 */
export function mapListingPreviewDTO(dto: ListingPreviewDTO): ListingPreview {
  const createdAt =
    typeof dto.createdAt === "string"
      ? dto.createdAt
      : new Date(dto.createdAt).toISOString();

  return {
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    price: dto.price,
    originalPrice: dto.originalPrice || undefined,
    category: validateCategory(dto.category),
    condition: validateCondition(dto.condition),
    status: validateStatus(dto.status),
    images: dto.imageUrl
      ? [
          {
            id: "1",
            url: dto.imageUrl,
            alt: dto.title,
            isPrimary: true,
          },
        ]
      : [],
    seller: {
      id: dto.seller.id,
      name: dto.seller.name,
      isVerified: dto.seller.isVerified,
      rating: 4.5, // TODO: fetch actual rating
    },
    saves: 0,
    createdAt: createdAt,
  };
}

/**
 * Map multiple listing DTOs
 */
export function mapListingDTOs(dtos: ListingDTO[]): Listing[] {
  return dtos.map(mapListingDTO);
}

/**
 * Map multiple listing preview DTOs
 */
export function mapListingPreviewDTOs(dtos: ListingPreviewDTO[]): ListingPreview[] {
  return dtos.map(mapListingPreviewDTO);
}
