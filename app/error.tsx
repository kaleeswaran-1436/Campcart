"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[CampCart Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cc-bg)] p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="relative inline-block mb-8">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-200 dark:border-red-900/40 flex items-center justify-center mx-auto animate-pulse-soft">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-[var(--cc-text-primary)] mb-3">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--cc-text-secondary)] mb-6 leading-relaxed">
          We hit an unexpected error. This has been logged and we'll look into it.
          Try refreshing, or head back home.
        </p>

        {/* Error digest */}
        {error.digest && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-[var(--cc-bg-muted)] border border-[var(--cc-border-subtle)]">
            <p className="text-xs text-[var(--cc-text-disabled)] font-mono">Error ID: {error.digest}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64F] to-[#C8943C] text-white font-semibold text-sm hover:from-[#E5B95C] hover:to-[#D4A64F] transition-all duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--cc-border)] text-[var(--cc-text-secondary)] font-semibold text-sm hover:bg-[var(--cc-bg-muted)] hover:text-[var(--cc-text-primary)] transition-all duration-150"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
