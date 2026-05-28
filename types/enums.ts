/**
 * CampCart — Enum Definitions
 * 
 * IMPORTANT: Prisma schema is the single source of truth.
 * These values MUST match the Prisma enums exactly.
 * 
 * See: types/enums-unified.ts for maintained enum definitions
 */

import {
  LISTING_STATUS,
  PRODUCT_CONDITION,
  LISTING_CATEGORY,
  USER_ROLE,
  LISTING_STATUS_LABELS,
  PRODUCT_CONDITION_LABELS,
  LISTING_CATEGORY_LABELS,
  LISTING_STATUS_BADGE,
  PRODUCT_CONDITION_BADGE,
} from "./enums-unified";

import type {
  ListingStatus as TListingStatus,
  ProductCondition as TProductCondition,
  ListingCategory as TListingCategory,
  UserRole as TUserRole,
} from "./enums-unified";

export {
  LISTING_STATUS,
  PRODUCT_CONDITION,
  LISTING_CATEGORY,
  USER_ROLE,
  LISTING_STATUS_LABELS,
  PRODUCT_CONDITION_LABELS,
  LISTING_CATEGORY_LABELS,
  LISTING_STATUS_BADGE,
  PRODUCT_CONDITION_BADGE,
} from "./enums-unified";

// Merge local const and type to avoid 'Cannot redeclare exported variable' error
export const ListingStatus = LISTING_STATUS;
export type ListingStatus = TListingStatus;

export const ProductCondition = PRODUCT_CONDITION;
export type ProductCondition = TProductCondition;

export const ListingCategory = LISTING_CATEGORY;
export type ListingCategory = TListingCategory;

export const UserRole = USER_ROLE;
export type UserRole = TUserRole;

/* ── User / Auth ──────────────────────────────────────────── */

export const VerificationStatus = {
  UNVERIFIED:  "unverified",
  PENDING:     "pending",
  VERIFIED:    "verified",
  REJECTED:    "rejected",
  SUSPENDED:   "suspended",
} as const;
export type VerificationStatus = (typeof VerificationStatus)[keyof typeof VerificationStatus];

/* ── Exchange ─────────────────────────────────────────────── */

export const ExchangeStatus = {
  PENDING:    "pending",
  CONFIRMED:  "confirmed",
  IN_PROGRESS:"in-progress",
  COMPLETED:  "completed",
  CANCELLED:  "cancelled",
  DISPUTED:   "disputed",
} as const;
export type ExchangeStatus = (typeof ExchangeStatus)[keyof typeof ExchangeStatus];

export const ExchangeMethod = {
  QR_CODE:    "qr-code",
  IN_PERSON:  "in-person",
  DROP_OFF:   "drop-off",
} as const;
export type ExchangeMethod = (typeof ExchangeMethod)[keyof typeof ExchangeMethod];

/* ── Notifications ────────────────────────────────────────── */

export const NotificationType = {
  NEW_MESSAGE:       "new-message",
  LISTING_INTEREST:  "listing-interest",
  PRICE_DROP:        "price-drop",
  EXCHANGE_REQUEST:  "exchange-request",
  EXCHANGE_CONFIRMED:"exchange-confirmed",
  EXCHANGE_COMPLETED:"exchange-completed",
  VERIFICATION_DONE: "verification-done",
  LISTING_SOLD:      "listing-sold",
  LISTING_EXPIRED:   "listing-expired",
  SYSTEM:            "system",
} as const;
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];

/* ── Departments ──────────────────────────────────────────── */

export const Department = {
  CSE:    "Computer Science & Engineering",
  ECE:    "Electronics & Communication Engineering",
  ME:     "Mechanical Engineering",
  CE:     "Civil Engineering",
  EEE:    "Electrical & Electronics Engineering",
  IT:     "Information Technology",
  CHEM:   "Chemical Engineering",
  BIO:    "Biotechnology",
  MBA:    "Business Administration",
  MCA:    "Master of Computer Applications",
  MTECH:  "M.Tech",
  PHD:    "PhD / Research",
  OTHER:  "Other",
} as const;
export type Department = (typeof Department)[keyof typeof Department];

/* ── Chat ─────────────────────────────────────────────────── */

export const MessageStatus = {
  SENDING:   "sending",
  SENT:      "sent",
  DELIVERED: "delivered",
  READ:      "read",
  FAILED:    "failed",
} as const;
export type MessageStatus = (typeof MessageStatus)[keyof typeof MessageStatus];

/* ── UI ───────────────────────────────────────────────────── */

export const ToastType = {
  SUCCESS: "success",
  ERROR:   "error",
  WARNING: "warning",
  INFO:    "info",
} as const;
export type ToastType = (typeof ToastType)[keyof typeof ToastType];

export const SortOption = {
  NEWEST:     "newest",
  OLDEST:     "oldest",
  PRICE_ASC:  "price-asc",
  PRICE_DESC: "price-desc",
  POPULAR:    "popular",
  RELEVANCE:  "relevance",
} as const;
export type SortOption = (typeof SortOption)[keyof typeof SortOption];
