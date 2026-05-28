"use client";

import Link from "next/link";
import {
  ShieldX, AlertTriangle, RefreshCw,
  MessageCircle, ChevronRight,
} from "lucide-react";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/auth-store";

const COMMON_REASONS = [
  "Image was blurry or low resolution",
  "ID card details were not fully visible",
  "Uploaded document is not a valid student ID",
  "Name on ID doesn't match registration details",
  "ID card appears to be expired or tampered",
];

export default function VerifyRejectedPage() {
  const { rejectionReason, resetVerification } = useAuthStore();

  function handleReupload() {
    resetVerification();
  }

  return (
    <AuthCard
      title="Verification Failed"
      subtitle="We couldn't verify your student ID"
      showLogo={true}
    >
      {/* Error icon */}
      <div className="flex justify-center mb-6">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-red-500/10" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 border-2 border-red-500/25">
            <ShieldX className="h-9 w-9 text-red-400" />
          </span>
        </div>
      </div>

      {/* Specific rejection reason (if available from backend) */}
      {rejectionReason && (
        <div className="rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 mb-4 flex items-start gap-2.5 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-0.5">Reason from reviewer:</p>
            <p>{rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Common reasons */}
      <div className="rounded-xl border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] p-4 mb-6">
        <p className="text-sm font-medium text-[var(--cc-text-primary)] mb-3">
          Common reasons for rejection:
        </p>
        <ul className="space-y-2">
          {COMMON_REASONS.map((reason) => (
            <li key={reason} className="flex items-start gap-2 text-sm text-[var(--cc-text-secondary)]">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-[var(--cc-honey)]/20 bg-[var(--cc-honey)]/5 px-4 py-3 mb-6 text-xs text-[var(--cc-text-secondary)] space-y-1.5">
        <p className="font-medium text-[var(--cc-honey)] text-sm">Tips for a successful re-upload:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Use good lighting — avoid shadows and glare</li>
          <li>Capture the full front face of your ID card</li>
          <li>Ensure name, roll number, and college are clearly readable</li>
          <li>Use a flat surface and steady hand / proper camera</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          href={APP_ROUTES.verify ?? "/verify"}
          variant="primary"
          size="md"
          className="w-full"
          id="rejected-retry-btn"
          onClick={handleReupload}
        >
          <RefreshCw className="h-4 w-4 mr-1.5" />
          Try Again with New Photo
        </Button>

        <Link
          href="/support"
          className="flex items-center justify-center gap-1.5 text-sm text-[var(--cc-text-secondary)] hover:text-[var(--cc-honey)] transition-colors py-2"
          id="rejected-support-link"
        >
          <MessageCircle className="h-4 w-4" />
          Contact support for help
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </AuthCard>
  );
}
