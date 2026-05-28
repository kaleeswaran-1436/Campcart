import { Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number; // 0-indexed
  className?: string;
}

/**
 * Multi-step progress indicator.
 * Shows step labels, connection lines, check marks for completed steps.
 */
export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-0", className)} role="list" aria-label="Registration steps">
      {steps.map((label, idx) => {
        const done    = idx < currentStep;
        const active  = idx === currentStep;
        const pending = idx > currentStep;

        return (
          <div key={label} className="flex items-center" role="listitem">
            {/* Step node */}
            <div className="flex flex-col items-center gap-1">
              <div
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 text-xs font-semibold",
                  done    && "border-[var(--cc-primary)] bg-[var(--cc-primary)] text-white",
                  active  && "border-[var(--cc-primary)] bg-[var(--cc-primary-subtle)] text-[var(--cc-primary)]",
                  pending && "border-[var(--cc-border)] bg-[var(--cc-surface)] text-[var(--cc-text-disabled)]"
                )}
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium whitespace-nowrap hidden sm:block",
                  done    && "text-[var(--cc-primary)]",
                  active  && "text-[var(--cc-text-primary)]",
                  pending && "text-[var(--cc-text-disabled)]"
                )}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-10 sm:w-14 mx-1 rounded transition-colors duration-300",
                  idx < currentStep
                    ? "bg-[var(--cc-primary)]"
                    : "bg-[var(--cc-border)]"
                )}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
