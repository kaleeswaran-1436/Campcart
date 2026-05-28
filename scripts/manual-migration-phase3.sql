-- COMPLETE DATABASE SCHEMA FOR CAMPCART
-- Run this in Supabase SQL Editor to create all tables and indexes
-- This is the baseline schema + Phase 3 enhancements

-- DROP existing tables if needed (optional - for full reset)
-- DROP TABLE IF EXISTS "Message" CASCADE;
-- DROP TABLE IF EXISTS "Conversation" CASCADE;
-- DROP TABLE IF EXISTS "Transaction" CASCADE;
-- DROP TABLE IF EXISTS "Listing" CASCADE;
-- DROP TABLE IF EXISTS "User" CASCADE;

-- CreateTable User
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "profileImage" TEXT,
    "bio" TEXT,
    "department" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable Listing (with Phase 3 fields: slug, imageUrls, negotiable, tags, department)
CREATE TABLE IF NOT EXISTS "Listing" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "originalPrice" INTEGER,
    "imageUrl" TEXT,
    "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "slug" TEXT,
    "negotiable" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "department" TEXT,
    "sellerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Listing_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable Transaction
CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "meetupLocation" TEXT,
    "meetupTime" TIMESTAMP(3),
    "qrCode" TEXT,
    "exchangedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Transaction_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable Conversation
CREATE TABLE IF NOT EXISTS "Conversation" (
    "id" TEXT NOT NULL,
    "participant1Id" TEXT NOT NULL,
    "participant2Id" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'INITIATED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Conversation_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Conversation_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable Message
CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'TEXT',
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Message_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex User email
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex Listing slug (conditional to allow NULL values during migration)
CREATE UNIQUE INDEX IF NOT EXISTS "Listing_slug_key" ON "Listing"("slug") WHERE "slug" IS NOT NULL;

-- CreateIndex Listing category
CREATE INDEX IF NOT EXISTS "Listing_category_idx" ON "Listing"("category");

-- CreateIndex Listing status
CREATE INDEX IF NOT EXISTS "Listing_status_idx" ON "Listing"("status");

-- CreateIndex Listing sellerId
CREATE INDEX IF NOT EXISTS "Listing_sellerId_idx" ON "Listing"("sellerId");

-- CreateIndex Listing createdAt
CREATE INDEX IF NOT EXISTS "Listing_createdAt_idx" ON "Listing"("createdAt");

-- CreateIndex Transaction sellerId
CREATE INDEX IF NOT EXISTS "Transaction_sellerId_idx" ON "Transaction"("sellerId");

-- CreateIndex Transaction buyerId
CREATE INDEX IF NOT EXISTS "Transaction_buyerId_idx" ON "Transaction"("buyerId");

-- CreateIndex Conversation participant1Id
CREATE INDEX IF NOT EXISTS "Conversation_participant1Id_idx" ON "Conversation"("participant1Id");

-- CreateIndex Conversation participant2Id
CREATE INDEX IF NOT EXISTS "Conversation_participant2Id_idx" ON "Conversation"("participant2Id");

-- CreateIndex Message conversationId
CREATE INDEX IF NOT EXISTS "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex Message senderId
CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId");

-- ===== Phase 3 Data Population =====
-- Generate slugs for existing listings that don't have them yet
UPDATE "Listing" 
SET "slug" = CONCAT(
  LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE("title", '[^a-z0-9\s-]', '', 'gi'), 
      '\s+', '-', 'g'
    )
  ),
  '-',
  SUBSTRING("id"::text, 1, 8)
)
WHERE "slug" IS NULL AND "title" IS NOT NULL;

-- Verification query (run after to confirm):
-- SELECT COUNT(*) as total_users FROM "User";
-- SELECT COUNT(*) as total_listings FROM "Listing";
-- SELECT COUNT(*) as null_slugs FROM "Listing" WHERE "slug" IS NULL;

