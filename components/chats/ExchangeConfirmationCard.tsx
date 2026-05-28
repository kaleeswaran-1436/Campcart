"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface ExchangeConfirmationCardProps {
  transactionId: string;
  confirmerId: string;
  isBuyer: boolean;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  onConfirmed: (completed: boolean) => void;
}

export function ExchangeConfirmationCard({
  transactionId,
  confirmerId,
  isBuyer,
  buyerConfirmed,
  sellerConfirmed,
  onConfirmed,
}: ExchangeConfirmationCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myConfirmed = isBuyer ? buyerConfirmed : sellerConfirmed;
  const otherConfirmed = isBuyer ? sellerConfirmed : buyerConfirmed;
  const bothConfirmed = buyerConfirmed && sellerConfirmed;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/transactions/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, confirmerId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Confirmation failed");

      onConfirmed(data.completed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm exchange");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-4 my-3 rounded-2xl border border-[var(--cc-border)] bg-[var(--cc-surface)] overflow-hidden">
      {/* Card Header */}
      <div className="px-4 py-3 bg-[var(--cc-surface-alt)] border-b border-[var(--cc-border-subtle)] flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span className="text-sm font-semibold text-[var(--cc-text-primary)]">
          {bothConfirmed ? "Exchange Complete!" : "Confirm Exchange"}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {/* Status indicators */}
        <div className="space-y-2">
          <ConfirmParty
            label="Buyer"
            icon={<User className="h-3.5 w-3.5" />}
            confirmed={buyerConfirmed}
            isMe={isBuyer}
          />
          <ConfirmParty
            label="Seller"
            icon={<ShieldCheck className="h-3.5 w-3.5" />}
            confirmed={sellerConfirmed}
            isMe={!isBuyer}
          />
        </div>

        {!bothConfirmed && (
          <>
            {myConfirmed ? (
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-center">
                <p className="text-sm text-emerald-600 font-medium">
                  ✓ You confirmed! Waiting for {isBuyer ? "seller" : "buyer"}...
                </p>
              </div>
            ) : (
              <Button
                variant="primary"
                className="w-full gap-2"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Confirming...</>
                ) : (
                  <>Confirm Exchange Received</>
                )}
              </Button>
            )}

            {otherConfirmed && !myConfirmed && (
              <p className="text-xs text-center text-[var(--cc-text-secondary)]">
                The {isBuyer ? "seller" : "buyer"} has already confirmed. Confirm to complete!
              </p>
            )}
          </>
        )}

        {bothConfirmed && (
          <div className="flex flex-col items-center gap-2 py-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            <p className="text-sm font-semibold text-[var(--cc-text-primary)]">Transaction Completed!</p>
            <p className="text-xs text-[var(--cc-text-secondary)] text-center">
              Both parties confirmed the exchange. The listing has been marked as sold.
            </p>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}

function ConfirmParty({
  label,
  icon,
  confirmed,
  isMe,
}: {
  label: string;
  icon: React.ReactNode;
  confirmed: boolean;
  isMe: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
      confirmed
        ? "bg-emerald-500/10 border border-emerald-500/20"
        : "bg-[var(--cc-surface-alt)] border border-[var(--cc-border-subtle)]"
    )}>
      <span className={cn("shrink-0", confirmed ? "text-emerald-500" : "text-[var(--cc-text-tertiary)]")}>
        {icon}
      </span>
      <span className="font-medium text-[var(--cc-text-primary)]">
        {label} {isMe && <span className="text-[var(--cc-text-tertiary)] font-normal">(You)</span>}
      </span>
      <div className="ml-auto shrink-0">
        {confirmed ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : (
          <div className="h-4 w-4 rounded-full border-2 border-[var(--cc-border)] animate-pulse" />
        )}
      </div>
    </div>
  );
}
