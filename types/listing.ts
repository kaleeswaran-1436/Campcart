import type { ListingCategory, ListingStatus, ProductCondition } from "./enums";

export type ID = string;
export type Timestamp = string; // ISO 8601

export interface ListingImage {
  id: ID;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isPrimary: boolean;
  blurDataUrl?: string;
}

export interface ListingSeller {
  id: ID;
  name: string;
  avatar?: string;
  college: string;
  rating: number;
  totalSales: number;
  isVerified: boolean;
}

export interface Listing {
  id: ID;
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  negotiable: boolean;
  category: ListingCategory;
  condition: ProductCondition;
  status: ListingStatus;
  images: ListingImage[];
  seller: ListingSeller;
  department?: string;
  tags: string[];
  views: number;
  saves: number;
  campus: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  expiresAt?: Timestamp;
}

export type ListingPreview = Pick<
  Listing,
  | "id"
  | "slug"
  | "title"
  | "price"
  | "originalPrice"
  | "category"
  | "condition"
  | "status"
  | "images"
  | "saves"
  | "createdAt"
> & { seller: Pick<ListingSeller, "id" | "name" | "isVerified" | "rating"> };

export interface ListingFilters {
  category?: ListingCategory;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
  college?: string;
  department?: string;
  query?: string;
  sellerId?: string;
  status?: ListingStatus;
}
