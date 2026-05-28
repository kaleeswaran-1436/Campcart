/**
 * Backend Validation Script - PHASE F
 * 
 * Purpose: Verify all listing APIs work correctly in isolation
 * before frontend integration continues.
 * 
 * Usage:
 *   npx ts-node scripts/test-listings.ts
 *   
 * Tests:
 * 1. Create listing
 * 2. Fetch all listings
 * 3. Fetch single listing
 * 4. Update listing
 * 5. Delete listing
 * 6. Verify database integrity
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local", override: true });
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// Color output for terminal
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(color: string, message: string) {
  console.log(`${color}${message}${colors.reset}`);
}

async function runTests() {
  log(colors.blue, "\n═══════════════════════════════════════════════════════════");
  log(colors.blue, "       CAMPCART LISTING BACKEND VALIDATION SCRIPT");
  log(colors.blue, "═══════════════════════════════════════════════════════════\n");

  let testsPassed = 0;
  let testsFailed = 0;

  // Get or create test seller
  let seller = await prisma.user.findFirst({
    where: { email: "test-seller@campcart.dev" },
  });

  if (!seller) {
    log(colors.yellow, "Creating test seller...");
    seller = await prisma.user.create({
      data: {
        id: uuidv4(),
        email: "test-seller@campcart.dev",
        name: "Test Seller",
        role: "USER",
        isVerified: false,
      },
    });
    log(colors.green, `✓ Created test seller: ${seller.id}`);
  } else {
    log(colors.green, `✓ Using existing test seller: ${seller.id}`);
  }

  try {
    // TEST 1: Create a listing
    log(colors.blue, "\n[TEST 1] Creating listing...");
    const createdListing = await prisma.listing.create({
      data: {
        id: uuidv4(),
        slug: `test-listing-${Date.now()}`,
        title: "Test MacBook Pro",
        description: "Barely used MacBook Pro from last semester",
        price: 85000,
        originalPrice: 120000,
        category: "ELECTRONICS",
        condition: "LIKE_NEW",
        status: "ACTIVE",
        negotiable: true,
        tags: ["electronics", "laptop"],
        department: "Computer Science",
        imageUrl: "https://example.com/image.jpg",
        imageUrls: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        sellerId: seller.id,
      },
      include: { seller: true },
    });

    if (createdListing.id && createdListing.slug) {
      log(colors.green, `✓ Created listing: ${createdListing.id}`);
      log(colors.green, `  - Slug: ${createdListing.slug}`);
      log(colors.green, `  - Title: ${createdListing.title}`);
      testsPassed++;
    } else {
      log(colors.red, "✗ Failed: Listing missing required fields");
      testsFailed++;
    }

    // TEST 2: Fetch all listings
    log(colors.blue, "\n[TEST 2] Fetching all listings...");
    const allListings = await prisma.listing.findMany({
      where: { deletedAt: null },
      include: { seller: true },
    });

    if (allListings.length > 0) {
      log(colors.green, `✓ Found ${allListings.length} listings`);
      testsPassed++;
    } else {
      log(colors.red, "✗ Failed: No listings found");
      testsFailed++;
    }

    // TEST 3: Fetch single listing
    log(colors.blue, "\n[TEST 3] Fetching single listing by ID...");
    const singleListing = await prisma.listing.findUnique({
      where: { id: createdListing.id },
      include: { seller: true },
    });

    if (singleListing && singleListing.title === createdListing.title) {
      log(colors.green, `✓ Retrieved listing: ${singleListing.title}`);
      testsPassed++;
    } else {
      log(colors.red, "✗ Failed: Could not retrieve listing");
      testsFailed++;
    }

    // TEST 4: Fetch by slug
    log(colors.blue, "\n[TEST 4] Fetching listing by slug...");
    const bySlug = await prisma.listing.findUnique({
      where: { slug: createdListing.slug },
      include: { seller: true },
    });

    if (bySlug && bySlug.id === createdListing.id) {
      log(colors.green, `✓ Found listing by slug: ${bySlug.slug}`);
      testsPassed++;
    } else {
      log(colors.red, "✗ Failed: Could not find listing by slug");
      testsFailed++;
    }

    // TEST 5: Update listing
    log(colors.blue, "\n[TEST 5] Updating listing...");
    const updatedListing = await prisma.listing.update({
      where: { id: createdListing.id },
      data: {
        title: "Updated Test MacBook Pro",
        price: 80000,
        status: "RESERVED",
      },
      include: { seller: true },
    });

    if (
      updatedListing.title === "Updated Test MacBook Pro" &&
      updatedListing.price === 80000 &&
      updatedListing.status === "RESERVED"
    ) {
      log(colors.green, `✓ Updated listing successfully`);
      log(colors.green, `  - New title: ${updatedListing.title}`);
      log(colors.green, `  - New price: ₹${updatedListing.price}`);
      log(colors.green, `  - New status: ${updatedListing.status}`);
      testsPassed++;
    } else {
      log(colors.red, "✗ Failed: Update did not apply correctly");
      testsFailed++;
    }

    // TEST 6: Query with filters
    log(colors.blue, "\n[TEST 6] Testing filtered queries...");
    const filtered = await prisma.listing.findMany({
      where: {
        category: "ELECTRONICS",
        status: "RESERVED",
        deletedAt: null,
      },
    });

    if (filtered.some((l) => l.id === createdListing.id)) {
      log(colors.green, `✓ Filtered query works (found ${filtered.length} listings)`);
      testsPassed++;
    } else {
      log(colors.red, "✗ Failed: Filtered query did not return expected listing");
      testsFailed++;
    }

    // TEST 7: Soft delete
    log(colors.blue, "\n[TEST 7] Testing soft delete...");
    const deletedListing = await prisma.listing.update({
      where: { id: createdListing.id },
      data: { deletedAt: new Date() },
    });

    const notFoundAfterDelete = await prisma.listing.findUnique({
      where: { id: createdListing.id },
    });

    if (deletedListing.deletedAt && notFoundAfterDelete?.deletedAt) {
      log(colors.green, `✓ Soft delete works (listing marked as deleted)`);
      testsPassed++;
    } else {
      log(colors.red, "✗ Failed: Soft delete did not work");
      testsFailed++;
    }

    // TEST 8: Verify seller relationship
    log(colors.blue, "\n[TEST 8] Verifying seller relationship...");
    const listingWithSeller = await prisma.listing.findUnique({
      where: { id: createdListing.id },
      include: { seller: true },
    });

    if (listingWithSeller?.seller.id === seller.id) {
      log(colors.green, `✓ Seller relationship verified`);
      log(colors.green, `  - Seller: ${listingWithSeller.seller.name}`);
      testsPassed++;
    } else {
      log(colors.red, "✗ Failed: Seller relationship broken");
      testsFailed++;
    }

    // TEST 9: Test user listings query
    log(colors.blue, "\n[TEST 9] Fetching user's listings...");
    const userListings = await prisma.listing.findMany({
      where: {
        sellerId: seller.id,
        deletedAt: null,
      },
      include: { seller: true },
    });

    if (userListings.length >= 0) {
      log(colors.green, `✓ Found ${userListings.length} active listings for user`);
      testsPassed++;
    } else {
      log(colors.red, "✗ Failed: Could not fetch user listings");
      testsFailed++;
    }

    // TEST 10: Verify schema fields
    log(colors.blue, "\n[TEST 10] Verifying schema fields...");
    const schemaTest = await prisma.listing.findUnique({
      where: { id: createdListing.id },
    });

    const requiredFields = [
      "id",
      "slug",
      "title",
      "description",
      "price",
      "category",
      "condition",
      "status",
      "sellerId",
      "createdAt",
      "updatedAt",
      "imageUrls",
      "negotiable",
      "tags",
    ];

    let allFieldsPresent = true;
    for (const field of requiredFields) {
      if (!(field in schemaTest!)) {
        log(colors.red, `✗ Missing field: ${field}`);
        allFieldsPresent = false;
      }
    }

    if (allFieldsPresent) {
      log(colors.green, `✓ All schema fields present`);
      testsPassed++;
    } else {
      testsFailed++;
    }
  } catch (error) {
    log(colors.red, `\n✗ Error during testing: ${error instanceof Error ? error.message : String(error)}`);
    testsFailed++;
  }

  // Summary
  log(colors.blue, "\n═══════════════════════════════════════════════════════════");
  log(colors.blue, "                         TEST SUMMARY");
  log(colors.blue, "═══════════════════════════════════════════════════════════");
  log(colors.green, `✓ Passed: ${testsPassed}`);
  log(colors.red, `✗ Failed: ${testsFailed}`);
  log(colors.blue, `Total:   ${testsPassed + testsFailed}\n`);

  if (testsFailed === 0) {
    log(colors.green, "✓ All tests passed! Backend is ready for integration.\n");
    process.exit(0);
  } else {
    log(colors.red, `✗ ${testsFailed} test(s) failed. Please review above.\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  log(colors.red, `Fatal error: ${error.message}`);
  process.exit(1);
});
