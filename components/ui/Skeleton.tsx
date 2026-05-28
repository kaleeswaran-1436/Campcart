import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Height — use Tailwind h-* class or style prop */
  height?: string;
  width?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

const ROUNDED = {
  sm:   "rounded-sm",
  md:   "rounded-md",
  lg:   "rounded-lg",
  xl:   "rounded-xl",
  full: "rounded-full",
};

/**
 * Base skeleton shimmer block.
 * Use for any loading placeholder.
 *
 * @example
 * <Skeleton height="h-4" width="w-32" rounded="md" />
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, height, width, rounded = "md", style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("skeleton", ROUNDED[rounded], height, width, className)}
      style={style}
      aria-hidden="true"
      {...props}
    />
  )
);
Skeleton.displayName = "Skeleton";
