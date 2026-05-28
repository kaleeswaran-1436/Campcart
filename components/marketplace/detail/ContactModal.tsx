"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { MessageCircle } from "lucide-react";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellerName: string;
}

export function ContactModal({ open, onOpenChange, sellerName }: ContactModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`Chat with ${sellerName}`}
    >
      <div className="flex flex-col gap-6 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 mx-auto">
          <MessageCircle className="h-8 w-8" />
        </div>
        
        <p className="text-center text-sm text-[var(--cc-text-secondary)]">
          The chat system is currently under development. Soon, you'll be able to send instant messages to verified students.
        </p>

        <Button variant="primary" className="w-full mt-2" onClick={() => onOpenChange(false)}>
          Got it
        </Button>
      </div>
    </Modal>
  );
}
