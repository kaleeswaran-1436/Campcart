"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/auth-store";
import type { User, AuthSession } from "@/types/user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  useEffect(() => {
    const supabase = createClient();

    // 1. Initial hydration (optional if you want to double-check client-side)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Map Supabase user to our frontend User type
        const mockUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || "CampCart User",
          email: session.user.email || "",
          avatar: session.user.user_metadata?.avatar_url || null,
          verification: session.user.user_metadata?.isVerified ? "verified" : "unverified",
          rating: 0,
          joinedAt: session.user.created_at,
          college: "CampCart University",
          role: "USER",
          totalSales: 0,
          totalPurchases: 0,
        };

        const authSession: AuthSession = {
          user: mockUser,
          token: session.access_token,
          expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : new Date().toISOString(),
        };

        setSession(authSession);
      } else {
        clearSession();
      }
    });

    // 2. Listen for auth changes (login, logout, refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const mockUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || "CampCart User",
          email: session.user.email || "",
          avatar: session.user.user_metadata?.avatar_url || null,
          verification: session.user.user_metadata?.isVerified ? "verified" : "unverified",
          rating: 0,
          joinedAt: session.user.created_at,
          college: "CampCart University",
          role: "USER",
          totalSales: 0,
          totalPurchases: 0,
        };

        const authSession: AuthSession = {
          user: mockUser,
          token: session.access_token,
          expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : new Date().toISOString(),
        };

        setSession(authSession);
      } else {
        clearSession();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, clearSession]);

  return <>{children}</>;
}
