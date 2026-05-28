import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/listings/user
 * Fetch current user's listings (authenticated)
 */
export async function GET(request: NextRequest) {
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

    // 2. Fetch user's listings from database
    const listings = await prisma.listing.findMany({
      where: {
        sellerId: user.id,
        deletedAt: null,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(
      {
        listings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch user listings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
