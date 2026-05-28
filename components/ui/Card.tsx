import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

/* ── Sub-components ───────────────────────────────────────── */
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 pt-4 pb-2", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardBody = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 py-2", className)} {...props} />
  )
);
CardBody.displayName = "CardBody";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-4 pb-4 pt-2 border-t border-[var(--border-subtle)]", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

/* ── Card ─────────────────────────────────────────────────── */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable hover lift + shadow animation */
  interactive?: boolean;
  /** Remove default padding */
  flush?: boolean;
}

/**
 * CampCart Card.
 * Base surface container used for product listings, user profiles, etc.
 *
 * @example
 * <Card interactive>
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Content</CardBody>
 *   <CardFooter>Actions</CardFooter>
 * </Card>
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, flush = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "surface",
        !flush && "overflow-hidden",
        interactive && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

export { Card, CardHeader, CardBody, CardFooter };
