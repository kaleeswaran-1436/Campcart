"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MoreVertical, ShieldCheck, MapPin, QrCode, ScanLine } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/Button";
import type { Conversation } from "@/types/chat";
import { ListingStatus } from "@/types/enums";
import { ReserveModal } from "@/components/marketplace/detail/ReserveModal";
import { QRCodeModal } from "@/components/chats/QRCodeModal";
import { QRScannerView } from "@/components/chats/QRScannerView";
import { CURRENT_USER_ID } from "@/store/chat-store";

interface ChatHeaderProps {
  conversation: Conversation;
  transactionId?: string; // Present if a ListingTransaction has been created
  onQRSuccess?: (transactionId: string) => void;
}

export function ChatHeader({ conversation, transactionId, onQRSuccess }: ChatHeaderProps) {
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const otherParticipant =
    conversation.participants.find((p) => p.id !== CURRENT_USER_ID) ||
    conversation.participants[0]!;

  const isSeller = conversation.participants.find(
    (p) => p.id === CURRENT_USER_ID
  )?.id !== conversation.participants[0]?.id;

  const showGenerateQR =
    transactionId &&
    conversation.stage === "MEETUP_PLANNED";

  const showScanQR =
    transactionId &&
    conversation.stage === "MEETUP_PLANNED";

  return (
    <>
      <div className="sticky top-0 z-30 flex flex-col bg-[var(--cc-bg)]/80 backdrop-blur-xl border-b border-[var(--cc-border)]">
        <div className="flex h-14 items-center justify-between px-2 sm:px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" href={APP_ROUTES.dashboardChats} className="md:hidden shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3 overflow-hidden pl-1 md:pl-0">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-[var(--cc-surface-alt)] shrink-0">
                {otherParticipant.avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={otherParticipant.avatar} alt={otherParticipant.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-[var(--cc-primary)] text-white flex items-center justify-center font-bold text-sm">
                    {otherParticipant.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-[var(--cc-text-primary)] text-sm">
                    {otherParticipant.name}
                  </span>
                  {otherParticipant.isVerified && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                </div>
                <span className="text-[10px] font-medium text-[var(--cc-text-tertiary)] uppercase tracking-wider">
                  {conversation.stage.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Listing Context Bar */}
        <Link
          href={APP_ROUTES.listing(conversation.listingId)}
          className="flex items-center gap-3 p-3 bg-[var(--cc-surface)] hover:bg-[var(--cc-surface-hover)] transition-colors border-t border-[var(--cc-border-subtle)]"
        >
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-[var(--cc-surface-alt)]">
            {conversation.listingImageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={conversation.listingImageUrl} alt={conversation.listingTitle} className="h-full w-full object-cover" />
            )}
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="text-sm font-semibold text-[var(--cc-text-primary)] truncate">
              {conversation.listingTitle}
            </div>
            <div className="text-xs font-medium text-[var(--cc-primary)]">
              ₹{conversation.listingPrice.toLocaleString()} •{" "}
              {conversation.listingStatus === ListingStatus.ACTIVE
                ? "Available"
                : conversation.listingStatus}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Reserve button */}
            {conversation.listingStatus === ListingStatus.ACTIVE &&
              conversation.stage === "NEGOTIATING" && (
                <Button
                  variant="primary"
                  size="sm"
                  className="h-8 text-xs font-semibold"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsReserveModalOpen(true);
                  }}
                >
                  Reserve
                </Button>
              )}

            {/* Meetup button: RESERVED stage */}
            {conversation.stage === "RESERVED" && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold"
                onClick={(e) => e.preventDefault()}
              >
                <MapPin className="h-3.5 w-3.5 mr-1" /> Meetup
              </Button>
            )}

            {/* Seller: Generate QR | Buyer: Scan QR */}
            {showGenerateQR && isSeller && (
              <Button
                variant="primary"
                size="sm"
                className="h-8 text-xs font-semibold gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  setIsQRModalOpen(true);
                }}
              >
                <QrCode className="h-3.5 w-3.5" />
                QR
              </Button>
            )}

            {showScanQR && !isSeller && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  setIsScannerOpen(true);
                }}
              >
                <ScanLine className="h-3.5 w-3.5" />
                Scan
              </Button>
            )}
          </div>
        </Link>
      </div>

      {/* Modals */}
      <ReserveModal
        open={isReserveModalOpen}
        onOpenChange={setIsReserveModalOpen}
        listingId={conversation.listingId}
        source="chat-header"
      />

      {transactionId && (
        <QRCodeModal
          open={isQRModalOpen}
          onOpenChange={setIsQRModalOpen}
          transactionId={transactionId}
          sellerId={CURRENT_USER_ID}
        />
      )}

      {transactionId && (
        <QRScannerView
          open={isScannerOpen}
          onOpenChange={setIsScannerOpen}
          scannerId={CURRENT_USER_ID}
          onSuccess={(txId) => {
            setIsScannerOpen(false);
            onQRSuccess?.(txId);
          }}
        />
      )}
    </>
  );
}
