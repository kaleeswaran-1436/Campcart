import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

/* ── Variant map ─────────────────────────────────────────── */
const VARIANT_CLASSES = {
  default:    "bg-[var(--surface-hover)] text-[var(--foreground)] border border-[var(--border-subtle)]",
  mint:       "bg-[var(--color-mint-light)] text-[var(--color-slate-dark)] border border-[var(--color-mint)]",
  honey:      "bg-amber-50 text-[var(--color-honey-dark)] border border-amber-200",
  slate:      "bg-[var(--color-slate)] text-white border border-[var(--color-slate-dark)]",
  success:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  warning:    "bg-amber-50 text-amber-700 border border-amber-200",
  danger:     "bg-red-50 text-red-600 border border-red-200",
  verified:   "bg-[var(--color-mint-light)] text-[var(--color-slate-dark)] border border-[var(--color-mint-dark)]",
  new:        "bg-[var(--color-slate)] text-[var(--color-soft-white)] border border-transparent",
  used:       "bg-[var(--surface-hover)] text-[var(--muted)] border border-[var(--border)]",
} as const;

type BadgeVariant = keyof typeof VARIANT_CLASSES;

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  /** Small dot indicator on the left */
  dot?: boolean;
}

/**
 * CampCart Badge — used for listing conditions, user status, categories, etc.
 *
 * @example
 * <Badge variant="verified">Verified Seller</Badge>
 * <Badge variant="new">New</Badge>
 * <Badge variant="mint" dot>Active</Badge>
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", dot = false, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "badge",
          VARIANT_CLASSES[variant],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "inline-block h-1.5 w-1.5 rounded-full",
              variant === "success" ? "bg-emerald-500" :
              variant === "danger"  ? "bg-red-500"    :
              variant === "warning" ? "bg-amber-500"  :
              variant === "mint" || variant === "verified" ? "bg-[var(--color-mint-dark)]" :
              "bg-[var(--color-honey)]"
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
