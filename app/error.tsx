"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/routes";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Global error boundary — shown when an unhandled error occurs in the app.
 * Must be a Client Component per Next.js requirements.
 */
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to monitoring (e.g. Sentry) in production
    console.error("[CampCart Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cc-bg)] p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--cc-error-subtle)] text-[var(--cc-error)]">
            <AlertTriangle className="h-8 w-8" />
          </span>
        </div>

        {/* Copy */}
        <h1 className="text-2xl font-bold text-[var(--cc-text-primary)] mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--cc-text-secondary)] mb-6 leading-relaxed">
          We hit an unexpected error. This has been logged and we'll look into it.
          <br />
          Try refreshing, or head back home.
        </p>

        {/* Error digest (for support reference) */}
        {error.digest && (
          <p className="text-xs font-mono text-[var(--cc-text-disabled)] mb-6 bg-[var(--cc-bg-muted)] px-3 py-2 rounded-lg">
            Error ID: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            size="md"
            onClick={reset}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            href={APP_ROUTES.home}
            variant="outline"
            size="md"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
