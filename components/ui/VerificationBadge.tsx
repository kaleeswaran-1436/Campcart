import { ShieldCheck, ShieldAlert, ShieldX, Clock, Shield } from "lucide-react";
import { cn } from "@/utils/cn";
import type { VerificationStatus } from "@/types/enums";

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
  showLabel?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
}

const CONFIG: Record<
  VerificationStatus,
  { icon: typeof ShieldCheck; label: string; classes: string }
> = {
  verified: {
    icon: ShieldCheck,
    label: "Verified Student",
    classes:
      "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  pending: {
    icon: Clock,
    label: "Verification Pending",
    classes:
      "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  rejected: {
    icon: ShieldX,
    label: "Verification Failed",
    classes:
      "bg-red-500/15 text-red-400 border-red-500/30",
  },
  unverified: {
    icon: Shield,
    label: "Not Verified",
    classes:
      "bg-[var(--cc-surface-alt)] text-[var(--cc-text-secondary)] border-[var(--cc-border-subtle)]",
  },
  suspended: {
    icon: ShieldAlert,
    label: "Account Suspended",
    classes:
      "bg-red-900/20 text-red-300 border-red-800/40",
  },
};

const SIZE_CLASSES = {
  xs: { icon: "h-2.5 w-2.5", badge: "text-[10px] px-1.5 py-0.5 gap-0.5" },
  sm: { icon: "h-3 w-3",     badge: "text-xs px-2 py-0.5 gap-1"          },
  md: { icon: "h-4 w-4",     badge: "text-sm px-2.5 py-1 gap-1.5"        },
  lg: { icon: "h-5 w-5",     badge: "text-base px-3 py-1.5 gap-2"        },
};

export function VerificationBadge({
  status,
  className,
  showLabel = true,
  size = "md",
}: VerificationBadgeProps) {
  const { icon: Icon, label, classes } = CONFIG[status];
  const sizes = SIZE_CLASSES[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        classes,
        sizes.badge,
        className
      )}
      aria-label={label}
      title={label}
    >
      <Icon className={sizes.icon} aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </span>
  );
}
