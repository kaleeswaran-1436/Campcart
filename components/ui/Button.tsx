import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

/* ── Variant & Size maps ──────────────────────────────────── */
const VARIANT_CLASSES = {
  primary:
    "bg-[var(--color-honey)] text-white hover:bg-[var(--color-honey-dark)] active:bg-[var(--color-honey-dark)] shadow-sm",
  secondary:
    "bg-[var(--color-mint)] text-[var(--color-slate-dark)] hover:bg-[var(--color-mint-dark)] active:bg-[var(--color-mint-dark)]",
  outline:
    "bg-transparent border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] hover:border-[var(--color-slate-light)]",
  ghost:
    "bg-transparent text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
  danger:
    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
} as const;

const SIZE_CLASSES = {
  xs:  "h-7  px-2.5 text-xs  gap-1   rounded-md",
  sm:  "h-8  px-3   text-sm  gap-1.5 rounded-md",
  md:  "h-9  px-4   text-sm  gap-2   rounded-lg",
  lg:  "h-11 px-5   text-base gap-2  rounded-lg",
  xl:  "h-12 px-6   text-base gap-2.5 rounded-xl",
  icon: "h-9 w-9 p-0 flex items-center justify-center rounded-lg",
} as const;

type Variant = keyof typeof VARIANT_CLASSES;
type Size    = keyof typeof SIZE_CLASSES;

/* ── Base props shared between button and link ────────────── */
interface BaseButtonProps {
  variant?: Variant;
  size?: Size;
  /** Render as full-width block */
  fullWidth?: boolean;
  /** Loading state — disables and shows spinner */
  loading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/* ── Button (renders <button>) ────────────────────────────── */
type ButtonAsButton = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    href?: undefined;
  };

/* ── Link (renders <a> via next/link) ──────────────────────── */
type ButtonAsLink = BaseButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const BASE_CLASSES =
  "inline-flex items-center justify-center font-medium select-none cursor-pointer " +
  "transition-all duration-150 ease-in-out " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-honey)]";

/**
 * CampCart polymorphic Button.
 * Renders as <button> by default, or <Link> when `href` is provided.
 *
 * @example
 * <Button variant="primary" size="md">Buy Now</Button>
 * <Button href="/browse" variant="outline">Browse</Button>
 */
export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(({ variant = "primary", size = "md", fullWidth = false, loading = false, className, children, ...props }, ref) => {
  const classes = cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {loading && (
        <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  const { ...rest } = props as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      disabled={loading || (rest as ButtonAsButton).disabled}
      {...rest}
    >
      {content}
    </button>
  );
});

Button.displayName = "Button";
