import { GraduationCap } from "lucide-react";

/**
 * Global loading UI — shown by Next.js during page transitions.
 * Displays a branded spinner centered on screen.
 */
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[var(--cc-bg)]"
      aria-label="Loading…"
      role="status"
    >
      {/* Spinner ring */}
      <div className="relative h-12 w-12">
        <span className="absolute inset-0 rounded-full border-2 border-[var(--cc-border-subtle)]" />
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--cc-primary)] animate-spin" />
        <span className="absolute inset-1 flex items-center justify-center text-[var(--cc-primary)]">
          <GraduationCap className="h-5 w-5" />
        </span>
      </div>

      {/* Brand */}
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--cc-text-primary)] tracking-tight">
          Camp<span className="text-[var(--cc-primary)]">Cart</span>
        </p>
        <p className="text-xs text-[var(--cc-text-secondary)] mt-0.5">Loading…</p>
      </div>
    </div>
  );
}
