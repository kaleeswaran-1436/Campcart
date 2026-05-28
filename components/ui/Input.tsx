import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/* ── Size map ─────────────────────────────────────────────── */
const SIZE_CLASSES = {
  sm:  "h-8  px-2.5 text-sm",
  md:  "h-9  px-3   text-sm",
  lg:  "h-11 px-4   text-base",
} as const;

type InputSize = keyof typeof SIZE_CLASSES;

/* ── Base input classes ───────────────────────────────────── */
const BASE_INPUT =
  "w-full rounded-lg border bg-[var(--cc-surface)] text-[var(--cc-text-primary)] " +
  "placeholder:text-[var(--cc-text-disabled)] " +
  "border-[var(--cc-border)] " +
  "transition-colors duration-150 " +
  "focus:outline-none focus:ring-2 focus:ring-[var(--cc-border-focus)] focus:ring-offset-0 focus:border-[var(--cc-border-focus)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "aria-[invalid=true]:border-[var(--cc-error)] aria-[invalid=true]:focus:ring-[var(--cc-error)]";

/* ── Input ────────────────────────────────────────────────── */
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  inputSize?: InputSize;
  /** Show error ring */
  error?: boolean;
  /** Prefix icon/element */
  prefix?: React.ReactNode;
  /** Suffix icon/element */
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize = "md", error = false, prefix, suffix, className, ...props }, ref) => {
    if (prefix ?? suffix) {
      return (
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 flex items-center text-[var(--cc-text-secondary)] pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            aria-invalid={error || undefined}
            className={cn(
              BASE_INPUT,
              SIZE_CLASSES[inputSize],
              prefix && "pl-9",
              suffix && "pr-9",
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 flex items-center text-[var(--cc-text-secondary)]">
              {suffix}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(BASE_INPUT, SIZE_CLASSES[inputSize], className)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

/* ── Textarea ─────────────────────────────────────────────── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  resize?: "none" | "vertical" | "horizontal" | "both";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error = false, resize = "vertical", className, ...props }, ref) => {
    const resizeClass = {
      none:       "resize-none",
      vertical:   "resize-y",
      horizontal: "resize-x",
      both:       "resize",
    }[resize];

    return (
      <textarea
        ref={ref}
        aria-invalid={error || undefined}
        className={cn(
          BASE_INPUT,
          "min-h-[100px] py-2.5 px-3 text-sm",
          resizeClass,
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
