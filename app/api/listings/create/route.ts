import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { listingSchema } from "@/lib/forms/schemas/listing.schema";
import { generateSlug, generateUniqueSlug } from "@/lib/slug";
import { v4 as uuidv4 } from "uuid";

/**
 * POST /api/listings/create
 * Create a new listing (authenticated)
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user via Supabase
    const supabase = createServerClient(
      env.client.NEXT_PUBLIC_SUPABASE_URL,
      env.client.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            );
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validationResult = listingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: validationResult.error.issues },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const listingId = uuidv4();
    
    // Generate SEO-friendly slug
    const baseSlug = generateSlug(data.title);
    const slug = generateUniqueSlug(baseSlug, listingId);

    // 3. Create listing in database
    const listing = await prisma.listing.create({
      data: {
        id: listingId,
        slug,
        title: data.title,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice || null,
        category: data.category,
        condition: data.condition,
        status: "ACTIVE",
        negotiable: data.negotiable || false,
        tags: data.tags || [],
        department: data.department || null,
        imageUrl: data.imageUrls[0] || null, // Primary image
        imageUrls: data.imageUrls, // All images
        sellerId: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        listing: {
          id: listing.id,
          title: listing.title,
          slug: listing.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
