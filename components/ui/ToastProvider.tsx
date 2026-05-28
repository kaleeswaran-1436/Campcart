"use client";


import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/utils/cn";
import { useNotificationStore } from "@/store/notification-store";
import type { ToastItem } from "@/types/ui";

/* ── Single toast ────────────────────────────────────────── */
const TOAST_STYLES = {
  success: {
    wrapper: "border-[var(--cc-success-border)] bg-[var(--cc-success-subtle)]",
    icon:    "text-[var(--cc-success)]",
    bar:     "bg-[var(--cc-success)]",
    Icon:    CheckCircle2,
  },
  error: {
    wrapper: "border-[var(--cc-error-border)] bg-[var(--cc-error-subtle)]",
    icon:    "text-[var(--cc-error)]",
    bar:     "bg-[var(--cc-error)]",
    Icon:    AlertCircle,
  },
  warning: {
    wrapper: "border-[var(--cc-warning-border)] bg-[var(--cc-warning-subtle)]",
    icon:    "text-[var(--cc-warning)]",
    bar:     "bg-[var(--cc-warning)]",
    Icon:    AlertTriangle,
  },
  info: {
    wrapper: "border-[var(--cc-info-border)] bg-[var(--cc-info-subtle)]",
    icon:    "text-[var(--cc-info)]",
    bar:     "bg-[var(--cc-info)]",
    Icon:    Info,
  },
};

function Toast({ toast }: { toast: ToastItem }) {
  const { removeToast } = useNotificationStore();
  const style = TOAST_STYLES[toast.type];
  const { Icon } = style;
  const duration = toast.duration ?? 4000;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "relative overflow-hidden w-full max-w-sm rounded-xl border shadow-[var(--cc-shadow-lg)]",
        "animate-fade-in-up",
        style.wrapper
      )}
    >
      {/* Progress bar */}
      <div
        className={cn("absolute top-0 left-0 h-0.5 rounded-full", style.bar)}
        style={{ animation: `shrinkWidth ${duration}ms linear forwards` }}
      />

      <div className="flex items-start gap-3 p-4">
        <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", style.icon)} aria-hidden />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--cc-text-primary)] leading-snug">
            {toast.title}
          </p>
          {toast.description && (
            <p className="text-xs text-[var(--cc-text-secondary)] mt-0.5 leading-relaxed">
              {toast.description}
            </p>
          )}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-1.5 text-xs font-semibold text-[var(--cc-primary)] hover:underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          aria-label="Dismiss notification"
          className="shrink-0 p-1 rounded-md text-[var(--cc-text-secondary)] hover:bg-black/5 transition-colors"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/* ── Toast container ─────────────────────────────────────── */
export function ToastProvider() {
  const { toasts } = useNotificationStore();

  return (
    <>
      {/* Inject shrink animation */}
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>

      <div
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end"
      >
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} />
        ))}
      </div>
    </>
  );
}
