"use client";

import { useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ListingStatus } from "@/types/enums";
import { ReserveModal } from "./ReserveModal";
import { ContactModal } from "./ContactModal";

interface TransactionActionsProps {
  listingId: string;
  status: ListingStatus;
  sellerName: string;
}

export function TransactionActions({ listingId, status, sellerName }: TransactionActionsProps) {
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const isAvailable = status === ListingStatus.ACTIVE;
  const isSold = status === ListingStatus.SOLD;
  const isReserved = status === ListingStatus.RESERVED;

  let reserveLabel = "Reserve Item";
  if (isSold) reserveLabel = "Sold";
  if (isReserved) reserveLabel = "Reserved";

  return (
    <>
      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full font-bold shadow-sm"
          disabled={!isAvailable}
          onClick={() => setIsReserveOpen(true)}
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          {reserveLabel}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full font-bold bg-white"
          onClick={() => setIsContactOpen(true)}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Chat with Seller
        </Button>
      </div>

      <ReserveModal
        open={isReserveOpen}
        onOpenChange={setIsReserveOpen}
        listingId={listingId}
      />
      
      <ContactModal
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
        sellerName={sellerName}
      />
    </>
  );
}
