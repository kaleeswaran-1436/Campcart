"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthSession } from "@/types/user";
import type { VerificationStatus } from "@/types/enums";

/* ── OCR extracted data ──────────────────────────────────── */
export interface OcrExtractedData {
  name?: string;
  rollNumber?: string;
  department?: string;
  college?: string;
  batch?: string;
  confidence: number; // 0-100
}

/* ── Verification step ───────────────────────────────────── */
export type VerificationStep =
  | "idle"
  | "uploading"
  | "scanning"
  | "validating"
  | "pending"
  | "approved"
  | "rejected";

interface AuthState {
  /* Session */
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  /* Verification flow state */
  verificationStep: VerificationStep;
  verificationStatus: VerificationStatus;
  ocrData: OcrExtractedData | null;
  idCardPreviewUrl: string | null;
  rejectionReason: string | null;
  verificationProgress: number; // 0-100

  /* Actions — Session */
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  setUser: (user: User) => void;
  setLoading: (v: boolean) => void;

  /* Actions — Verification */
  setVerificationStep: (step: VerificationStep) => void;
  setOcrData: (data: OcrExtractedData) => void;
  setIdCardPreview: (url: string | null) => void;
  setRejectionReason: (reason: string) => void;
  setVerificationProgress: (pct: number) => void;
  resetVerification: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      /* ── Session ─────────────────────────────────────── */
      user:            null,
      token:           null,
      isAuthenticated: false,
      isLoading:       false,

      /* ── Verification ────────────────────────────────── */
      verificationStep:     "idle",
      verificationStatus:   "unverified",
      ocrData:              null,
      idCardPreviewUrl:     null,
      rejectionReason:      null,
      verificationProgress: 0,

      /* ── Session actions ─────────────────────────────── */
      setSession: (session) =>
        set({
          user:            session.user,
          token:           session.token,
          isAuthenticated: true,
          isLoading:       false,
          verificationStatus: session.user.verification,
        }),

      clearSession: () =>
        set({
          user: null, token: null, isAuthenticated: false,
          verificationStep: "idle", ocrData: null,
          idCardPreviewUrl: null, rejectionReason: null,
        }),

      setUser:    (user)      => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      /* ── Verification actions ─────────────────────────── */
      setVerificationStep: (verificationStep) => set({ verificationStep }),
      setOcrData:          (ocrData)          => set({ ocrData }),
      setIdCardPreview:    (idCardPreviewUrl)  => set({ idCardPreviewUrl }),
      setRejectionReason:  (rejectionReason)  => set({ rejectionReason }),
      setVerificationProgress: (verificationProgress) => set({ verificationProgress }),

      resetVerification: () =>
        set({
          verificationStep:     "idle",
          ocrData:              null,
          idCardPreviewUrl:     null,
          rejectionReason:      null,
          verificationProgress: 0,
        }),
    }),
    {
      name: "campcart-auth",
      partialize: (s) => ({
        token:             s.token,
        user:              s.user,
        isAuthenticated:   s.isAuthenticated,
        verificationStatus: s.verificationStatus,
      }),
    }
  )
);
