import { cn } from "@/utils/cn";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: { value: string; positive: boolean };
  className?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconColor = "text-[var(--cc-primary)]",
  iconBg = "bg-[var(--cc-primary-subtle)]",
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "surface p-4 flex flex-col gap-3",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-[var(--cc-text-secondary)] uppercase tracking-wide">
          {label}
        </p>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </span>
      </div>

      <div>
        <p className="text-2xl font-bold text-[var(--cc-text-primary)] leading-none">
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-[var(--cc-text-secondary)] mt-1">{subtext}</p>
        )}
      </div>

      {trend && (
        <p
          className={cn(
            "text-xs font-medium",
            trend.positive ? "text-[var(--cc-success)]" : "text-[var(--cc-error)]"
          )}
        >
          {trend.positive ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}
