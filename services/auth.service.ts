import { api } from "@/lib/api/client";
import type { AuthSession, LoginCredentials, RegisterPayload, VerifyIdPayload, User } from "@/types/user";
import type { OcrExtractedData } from "@/store/auth-store";

/* ─────────────────────────────────────────────────────────────
   CampCart Auth Service
   All API calls for authentication + verification flows.
   ───────────────────────────────────────────────────────────── */

import { createClient } from "@/lib/supabase/client";

export const authService = {
  /**
   * Authenticate with email + password using Supabase.
   */
  login: async (credentials: LoginCredentials): Promise<AuthSession> => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.session) {
      const err = new Error(error?.message || "Sign in failed");
      (err as any).isUnauthorized = true;
      (err as any).userMessage = error?.message;
      throw err;
    }

    const { session } = data;
    const user: User = {
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

    return {
      user,
      token: session.access_token,
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : new Date().toISOString(),
    };
  },

  /**
   * Register a new student account using Supabase.
   */
  register: async (payload: RegisterPayload): Promise<AuthSession> => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          full_name: payload.name,
          college: payload.college,
          rollNumber: payload.rollNumber,
          department: payload.department,
          isVerified: false,
        },
      },
    });

    if (error || !data.session) {
      throw new Error(error?.message || "Registration failed (you may need to confirm your email)");
    }

    const { session } = data;
    const user: User = {
      id: session.user.id,
      name: session.user.user_metadata?.full_name || "CampCart User",
      email: session.user.email || "",
      avatar: session.user.user_metadata?.avatar_url || null,
      verification: "unverified",
      rating: 0,
      joinedAt: session.user.created_at,
      college: payload.college,
      role: "USER",
      totalSales: 0,
      totalPurchases: 0,
    };

    return {
      user,
      token: session.access_token,
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : new Date().toISOString(),
    };
  },

  /**
   * Log out — signs out of Supabase.
   */
  logout: async (token: string) => {
    const supabase = createClient();
    await supabase.auth.signOut();
  },

  /**
   * Refresh an expiring JWT. (Handled automatically by Supabase client in background).
   */
  refreshToken: async (token: string) => {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) throw new Error("Could not refresh token");
    
    // We mock the return as it is barely needed now that we have AuthProvider sync
    return {
      user: { id: session.user.id } as User,
      token: session.access_token,
      expiresAt: new Date().toISOString(),
    };
  },

  /**
   * Get the current user profile.
   */
  me: (token: string) =>
    api.get<User>("/auth/me", { token }),

  /**
   * Upload student ID card and trigger OCR scanning.
   * Returns extracted OCR data.
   */
  uploadIdCard: (payload: VerifyIdPayload & { token: string }) =>
    api.post<OcrExtractedData>("/auth/verify/upload", payload, { token: payload.token }),

  /**
   * Submit corrected OCR data to finalize verification request.
   */
  submitVerification: (data: Partial<OcrExtractedData> & { token: string }) =>
    api.post<{ status: "pending" }>("/auth/verify/submit", data, { token: data.token }),

  /**
   * Get current verification status.
   */
  getVerificationStatus: (token: string) =>
    api.get<{ status: string; reason?: string }>("/auth/verify/status", { token }),

  /**
   * Request password reset email.
   */
  forgotPassword: (email: string) =>
    api.post<void>("/auth/forgot-password", { email }),

  /**
   * Reset password with token.
   */
  resetPassword: (resetToken: string, password: string) =>
    api.post<void>("/auth/reset-password", { token: resetToken, password }),
};
