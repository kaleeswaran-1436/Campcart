"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ShoppingBag } from "lucide-react";

interface ReserveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  source?: "listing-page" | "chat-header";
}

export function ReserveModal({ open, onOpenChange, listingId: _listingId, source: _source = "listing-page" }: ReserveModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Reserve this item?"
      description="Reserving an item notifies the seller that you intend to buy it."
    >
      <div className="flex flex-col gap-6 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cc-primary)]/10 text-[var(--cc-primary)] mx-auto">
          <ShoppingBag className="h-8 w-8" />
        </div>
        
        <p className="text-center text-sm text-[var(--cc-text-secondary)]">
          You are about to initiate an exchange request for this item. Once confirmed, you will be able to set up a meeting or use the QR exchange system.
        </p>

        <div className="flex flex-col gap-3 mt-2">
          <Button variant="primary" className="w-full" onClick={() => onOpenChange(false)}>
            Confirm Reservation
          </Button>
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
