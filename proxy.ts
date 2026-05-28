import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

/** Routes that require authentication */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/sell",
  "/exchanges",
  "/chats",
  "/admin",
];

/** Routes that require verified student status */
const VERIFIED_ONLY_PREFIXES = [
  "/sell",
  "/exchanges",
];

/** Routes only for guests (redirect authenticated users) */
const GUEST_ONLY_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
}

function isVerifiedOnly(pathname: string) {
  return VERIFIED_ONLY_PREFIXES.some((p) => pathname.startsWith(p));
}

function isGuestOnly(pathname: string) {
  return GUEST_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

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
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { pathname } = request.nextUrl;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Note: Assuming Supabase user_metadata or custom claims for 'verified'
  // We'll treat all users as unverified for now until we implement verification sync
  const verified = user?.user_metadata?.isVerified === true;

  /* Guest-only: redirect authenticated users to browse */
  if (isGuestOnly(pathname) && user) {
    return NextResponse.redirect(new URL("/browse", request.url));
  }

  /* Protected: redirect unauthenticated users to login */
  if (isProtected(pathname) && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* Verified-only: redirect unverified users to verification */
  if (isVerifiedOnly(pathname) && user && !verified) {
    return NextResponse.redirect(new URL("/verify", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/|api/).*)",
  ],
};
