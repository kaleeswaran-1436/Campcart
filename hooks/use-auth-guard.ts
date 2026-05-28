"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { APP_ROUTES } from "@/constants/routes";

interface UseAuthGuardOptions {
  /** If true, redirect unauthenticated users to login. Default: true */
  requireAuth?: boolean;
  /** If true, redirect unverified users to the verify page. Default: false */
  requireVerified?: boolean;
  /** Custom redirect path (overrides default) */
  redirectTo?: string;
}

/**
 * Client-side auth guard hook.
 * Use in page components that require authentication or verification.
 *
 * Note: Server-side route protection is handled by middleware.ts.
 * This hook is for client-driven scenarios (post-login redirects, etc.)
 *
 * @example
 * // Require auth only
 * useAuthGuard();
 *
 * @example
 * // Require verified student
 * useAuthGuard({ requireVerified: true });
 */
export function useAuthGuard({
  requireAuth = true,
  requireVerified = false,
  redirectTo,
}: UseAuthGuardOptions = {}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, verificationStatus } = useAuthStore();

  useEffect(() => {
    if (isLoading) return; // Wait for hydration

    if (requireAuth && !isAuthenticated) {
      const path = redirectTo ?? APP_ROUTES.login;
      router.replace(path);
      return;
    }

    if (requireVerified && verificationStatus !== "verified") {
      if (verificationStatus === "pending") {
        router.replace(APP_ROUTES.verifyPending ?? "/verify/pending");
      } else {
        router.replace(APP_ROUTES.verify ?? "/verify");
      }
    }
  }, [isAuthenticated, isLoading, verificationStatus, requireAuth, requireVerified, redirectTo, router]);

  return {
    isAuthenticated,
    isLoading,
    verificationStatus,
    /** True when the guard check is still pending (store hydrating) */
    isGuardPending: isLoading,
  };
}
