import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Apply a narrower max-width (prose content) */
  narrow?: boolean;
  /** Remove horizontal padding */
  flush?: boolean;
}

/**
 * CampCart responsive container.
 * Centres content and applies consistent horizontal padding.
 * Max-width follows: lg → 72rem, xl → 80rem, 2xl → 90rem.
 */
const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, narrow = false, flush = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full mx-auto",
          !flush && "px-4 sm:px-6 md:px-8",
          narrow
            ? "max-w-3xl"
            : "max-w-[90rem]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export { Container };
