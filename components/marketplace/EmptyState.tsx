import { PackageOpen } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = <PackageOpen className="h-10 w-10 text-[var(--cc-text-disabled)]" />,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12",
        "rounded-2xl border border-dashed border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)]",
        className
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cc-surface)] shadow-sm">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-[var(--cc-text-primary)]">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-[var(--cc-text-secondary)] leading-relaxed">
        {description}
      </p>
      {action && (
        <Button variant="outline" size="md" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
