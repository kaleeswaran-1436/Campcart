import { type ReactNode, type HTMLAttributes } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/utils/cn";

interface AuthCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Page heading */
  title: string;
  /** Subtitle below heading */
  subtitle?: string;
  /** Optional footer content (links, legal copy, etc.) */
  footer?: ReactNode;
  /** Show the CampCart logo above the card */
  showLogo?: boolean;
}

/**
 * Centered auth card container — wraps all auth page forms.
 * Provides consistent padding, glass surface, heading, and footer slot.
 */
export function AuthCard({
  title,
  subtitle,
  footer,
  showLogo = true,
  children,
  className,
  ...rest
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[440px] mx-auto flex flex-col gap-6",
        className
      )}
      {...rest}
    >
      {/* Logo */}
      {showLogo && (
        <Link
          href="/"
          className="flex items-center gap-2 justify-center group"
          aria-label="CampCart home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--cc-honey)] shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="h-5 w-5 text-[var(--cc-dark)]" />
          </span>
          <span className="text-xl font-bold tracking-tight text-[var(--cc-text-primary)]">
            Camp<span className="text-[var(--cc-honey)]">Cart</span>
          </span>
        </Link>
      )}

      {/* Card body */}
      <div className="rounded-2xl border border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] shadow-lg shadow-black/10 p-6 sm:p-8">
        {/* Heading */}
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-2xl font-bold text-[var(--cc-text-primary)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-[var(--cc-text-secondary)]">{subtitle}</p>
          )}
        </div>

        {/* Form content */}
        {children}
      </div>

      {/* Footer slot */}
      {footer && (
        <div className="text-center text-sm text-[var(--cc-text-secondary)]">
          {footer}
        </div>
      )}
    </div>
  );
}
