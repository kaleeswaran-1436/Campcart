"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/cn";

const BASE =
  "w-full h-10 rounded-lg border px-3 pr-10 text-sm " +
  "bg-[var(--cc-surface)] text-[var(--cc-text-primary)] " +
  "placeholder:text-[var(--cc-text-disabled)] " +
  "border-[var(--cc-border)] " +
  "transition-colors duration-150 " +
  "focus:outline-none focus:ring-2 focus:ring-[var(--cc-border-focus)] focus:border-[var(--cc-border-focus)] " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "aria-[invalid=true]:border-[var(--cc-error)] aria-[invalid=true]:focus:ring-[var(--cc-error)]";

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
}

/**
 * Password input with show/hide toggle button.
 * Accessible: toggle button is keyboard-navigable with aria-label.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error = false, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="relative">
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          aria-invalid={error || undefined}
          className={cn(BASE, className)}
          {...props}
        />
        <button
          type="button"
          tabIndex={0}
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className={cn(
            "absolute right-2.5 top-1/2 -translate-y-1/2",
            "p-1 rounded-md text-[var(--cc-text-secondary)]",
            "hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)]",
            "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cc-border-focus)]"
          )}
        >
          {visible ? (
            <EyeOff className="h-4 w-4" aria-hidden />
          ) : (
            <Eye className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
