/**
 * Listing DTO (Data Transfer Object) types
 * 
 * These represent the raw data shapes returned from Prisma/API.
 * Use mappers to convert these to strongly-typed frontend types.
 */

export type ID = string;

export interface ListingImageDTO {
  id: ID;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ListingSellerDTO {
  id: ID;
  name: string;
  email: string;
  avatar: string | null;
  isVerified: boolean;
  createdAt: Date;
}

export interface ListingDTO {
  id: ID;
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  category: string; // Raw string from database
  condition: string; // Raw string from database
  status: string; // Raw string from database
  imageUrl: string | null;
  imageUrls?: string[];
  tags: string[];
  negotiable: boolean;
  department: string | null;
  sellerId: ID;
  seller?: ListingSellerDTO;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ListingPreviewDTO {
  id: ID;
  slug: string;
  title: string;
  price: number;
  originalPrice: number | null;
  category: string;
  condition: string;
  status: string;
  imageUrl: string | null;
  createdAt: Date | string;
  seller: {
    id: ID;
    name: string;
    avatar: string | null;
    isVerified: boolean;
  };
}
