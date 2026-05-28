"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import type { ModalSize } from "@/types/ui";

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-xl",
  full: "max-w-full min-h-screen rounded-none",
};

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  /** Hide the X close button */
  hideClose?: boolean;
  /** Prevent closing by clicking overlay */
  preventClose?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * CampCart Modal — built on Radix Dialog for full accessibility.
 * Supports focus trap, Escape to close, aria-labelled.
 *
 * @example
 * <Modal open={open} onOpenChange={setOpen} title="Confirm Exchange" size="md">
 *   <p>Are you sure you want to initiate this exchange?</p>
 * </Modal>
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  size = "md",
  hideClose = false,
  preventClose = false,
  children,
  className,
}: ModalProps) {
  function handleOpenChange(next: boolean) {
    if (!next && preventClose) return;
    onOpenChange(next);
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:animate-fade-in",
            "data-[state=closed]:animate-fade-out"
          )}
        />

        {/* Panel */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-full mx-4",
            SIZE_CLASSES[size],
            "bg-[var(--cc-surface)] rounded-xl shadow-[var(--cc-shadow-dialog)]",
            "border border-[var(--cc-border-subtle)]",
            "focus:outline-none",
            "data-[state=open]:animate-scale-in",
            className
          )}
          aria-describedby={description ? "modal-description" : undefined}
        >
          {/* Header */}
          {(title ?? !hideClose) && (
            <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-[var(--cc-border-subtle)]">
              {title && (
                <Dialog.Title className="text-base font-semibold text-[var(--cc-text-primary)] leading-snug">
                  {title}
                </Dialog.Title>
              )}
              {!hideClose && (
                <Dialog.Close
                  className="ml-auto -mt-0.5 p-1.5 rounded-lg text-[var(--cc-text-secondary)] hover:bg-[var(--cc-bg-muted)] hover:text-[var(--cc-text-primary)] transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </Dialog.Close>
              )}
            </div>
          )}

          {description && (
            <Dialog.Description id="modal-description" className="sr-only">
              {description}
            </Dialog.Description>
          )}

          {/* Body */}
          <div className="px-5 py-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ── Modal Footer helper ───────────────────────────────────── */
export function ModalFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center justify-end gap-2 px-5 pb-5 pt-2 border-t border-[var(--cc-border-subtle)]", className)}>
      {children}
    </div>
  );
}
