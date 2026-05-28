/**
 * Enum Mappings - Prisma is Single Source of Truth
 * 
 * These enums match the Prisma schema exactly.
 * Do NOT redefine enum strings here - they come from Prisma.
 * 
 * This file is for:
 * 1. Type exports for frontend use
 * 2. Helper functions
 * 3. Display label mappings (for UX)
 */

// ============================================================================
// LISTING ENUMS
// ============================================================================

/**
 * Listing Status - must match Prisma enum
 * Prisma source: ListingStatus enum in schema.prisma
 */
export const LISTING_STATUS = {
  ACTIVE: "ACTIVE",
  RESERVED: "RESERVED",
  SOLD: "SOLD",
  EXPIRED: "EXPIRED",
  DRAFT: "DRAFT",
  REMOVED: "REMOVED",
} as const;

export type ListingStatus = (typeof LISTING_STATUS)[keyof typeof LISTING_STATUS];

/**
 * Product Condition - must match Prisma enum
 * Prisma source: ProductCondition enum in schema.prisma (if it exists)
 */
export const PRODUCT_CONDITION = {
  NEW: "NEW",
  LIKE_NEW: "LIKE_NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
  POOR: "POOR",
} as const;

export type ProductCondition = (typeof PRODUCT_CONDITION)[keyof typeof PRODUCT_CONDITION];

/**
 * Listing Category
 * NOTE: This is a string field in Prisma (not an enum)
 * Valid values must be enforced by application logic
 */
export const LISTING_CATEGORY = {
  BOOKS: "BOOKS",
  CALCULATORS: "CALCULATORS",
  LAB_MATERIALS: "LAB_MATERIALS",
  STATIONERY: "STATIONERY",
  ELECTRONICS: "ELECTRONICS",
  NOTES: "NOTES",
  INSTRUMENTS: "INSTRUMENTS",
  CLOTHING: "CLOTHING",
  OTHER: "OTHER",
} as const;

export type ListingCategory = (typeof LISTING_CATEGORY)[keyof typeof LISTING_CATEGORY];

// ============================================================================
// USER ENUMS
// ============================================================================

export const USER_ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

// ============================================================================
// DISPLAY LABELS
// ============================================================================

/**
 * User-friendly labels for enums
 * Use these when displaying values in the UI
 */
export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  ACTIVE: "Active",
  RESERVED: "Reserved",
  SOLD: "Sold",
  EXPIRED: "Expired",
  DRAFT: "Draft",
  REMOVED: "Removed",
};

export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

export const LISTING_CATEGORY_LABELS: Record<ListingCategory, string> = {
  BOOKS: "Books",
  CALCULATORS: "Calculators",
  LAB_MATERIALS: "Lab Materials",
  STATIONERY: "Stationery",
  ELECTRONICS: "Electronics",
  NOTES: "Notes",
  INSTRUMENTS: "Instruments",
  CLOTHING: "Clothing",
  OTHER: "Other",
};

// ============================================================================
// BADGE VARIANTS
// ============================================================================

export const LISTING_STATUS_BADGE: Record<ListingStatus, "mint" | "used" | "new" | "verified"> = {
  ACTIVE: "new",
  RESERVED: "mint",
  SOLD: "verified",
  EXPIRED: "used",
  DRAFT: "used",
  REMOVED: "used",
};

export const PRODUCT_CONDITION_BADGE: Record<ProductCondition, "mint" | "used" | "new" | "verified"> = {
  NEW: "new",
  LIKE_NEW: "mint",
  GOOD: "verified",
  FAIR: "used",
  POOR: "used",
};
