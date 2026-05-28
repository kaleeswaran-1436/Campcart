"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import type { DrawerSide } from "@/types/ui";

const SLIDE_CLASSES: Record<DrawerSide, string> = {
  right:  "inset-y-0 right-0 h-full data-[state=open]:animate-slide-in-right",
  left:   "inset-y-0 left-0  h-full data-[state=open]:animate-slide-in-left",
  bottom: "inset-x-0 bottom-0 w-full rounded-t-2xl data-[state=open]:animate-slide-in-bottom",
};

const WIDTH_CLASSES: Record<DrawerSide, string> = {
  right:  "w-full max-w-sm sm:max-w-md",
  left:   "w-full max-w-sm sm:max-w-md",
  bottom: "max-h-[90dvh] overflow-y-auto",
};

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DrawerSide;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * CampCart Drawer — slide-in panel for filters, mobile menus, item actions.
 * Built on Radix Dialog for full accessibility.
 *
 * @example
 * <Drawer open={isFilterOpen} onOpenChange={setFilterOpen} side="right" title="Filter Listings">
 *   <FilterPanel />
 * </Drawer>
 */
export function Drawer({
  open,
  onOpenChange,
  side = "right",
  title,
  description,
  children,
  className,
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out"
        />
        <Dialog.Content
          className={cn(
            "fixed z-50 bg-[var(--cc-surface)] shadow-[var(--cc-shadow-dialog)]",
            "border border-[var(--cc-border-subtle)]",
            "focus:outline-none",
            SLIDE_CLASSES[side],
            WIDTH_CLASSES[side],
            className
          )}
          aria-describedby={description ? "drawer-description" : undefined}
        >
          {/* Handle bar for bottom drawer */}
          {side === "bottom" && (
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-[var(--cc-border)]" />
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--cc-border-subtle)]">
            {title ? (
              <Dialog.Title className="text-sm font-semibold text-[var(--cc-text-primary)]">
                {title}
              </Dialog.Title>
            ) : (
              <span />
            )}
            <Dialog.Close
              className="p-1.5 rounded-lg text-[var(--cc-text-secondary)] hover:bg-[var(--cc-bg-muted)] hover:text-[var(--cc-text-primary)] transition-colors"
              aria-label="Close drawer"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          {description && (
            <Dialog.Description id="drawer-description" className="sr-only">
              {description}
            </Dialog.Description>
          )}

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-5 py-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
