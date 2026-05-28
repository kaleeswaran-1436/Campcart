"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, RefreshCw, Loader2, CheckCircle2, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QRCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  sellerId: string; // The current user must be the seller
}

type ModalState = "idle" | "loading" | "showing" | "scanned" | "error";

export function QRCodeModal({ open, onOpenChange, transactionId, sellerId }: QRCodeModalProps) {
  const [state, setState] = useState<ModalState>("idle");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const generateQR = useCallback(async () => {
    setState("loading");
    setError(null);
    setQrDataUrl(null);

    try {
      const res = await fetch("/api/transactions/qr/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, requesterId: sellerId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate QR");
      }

      const { signedToken, expiresAt: expiresAtStr } = await res.json();
      const expiry = new Date(expiresAtStr);
      setExpiresAt(expiry);

      // Dynamically import qrcode to avoid SSR issues
      const QRCode = (await import("qrcode")).default;
      const dataUrl = await QRCode.toDataURL(signedToken, {
        width: 280,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
      });

      setQrDataUrl(dataUrl);
      setState("showing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate QR");
      setState("error");
    }
  }, [transactionId, sellerId]);

  // Countdown timer
  useEffect(() => {
    if (state !== "showing" || !expiresAt) return;

    const tick = () => {
      const secs = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
      setSecondsLeft(secs);
      if (secs === 0) {
        setState("error");
        setError("QR code expired. Regenerate to continue.");
      }
    };

    tick();
    timerRef.current = setInterval(tick, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state, expiresAt]);

  // Cleanup on close
  useEffect(() => {
    if (!open) {
      setState("idle");
      setQrDataUrl(null);
      setExpiresAt(null);
      setError(null);
      if (timerRef.current) clearInterval(timerRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    } else {
      generateQR();
    }
  }, [open, generateQR]);

  if (!open) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerColor = secondsLeft < 60 ? "text-red-500" : "text-emerald-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
    >
      <div className="relative w-full max-w-sm mx-4 bg-[var(--cc-bg)] rounded-2xl shadow-2xl border border-[var(--cc-border)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--cc-border)]">
          <div>
            <h2 className="font-bold text-[var(--cc-text-primary)] text-lg">Exchange QR</h2>
            <p className="text-xs text-[var(--cc-text-secondary)] mt-0.5">Show this to the buyer to scan</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center gap-4">
          {(state === "loading") && (
            <div className="flex flex-col items-center gap-3 py-10">
              <Loader2 className="h-10 w-10 text-[var(--cc-primary)] animate-spin" />
              <span className="text-sm text-[var(--cc-text-secondary)]">Generating secure QR...</span>
            </div>
          )}

          {state === "showing" && qrDataUrl && (
            <>
              <div className="relative p-3 bg-white rounded-2xl shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="Exchange QR Code" className="w-[260px] h-[260px]" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 bg-[var(--cc-primary)] rounded-lg flex items-center justify-center shadow-lg">
                    <ScanLine className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-2 text-sm font-mono font-bold ${timerColor}`}>
                <span>Expires in:</span>
                <span>{mins}:{secs.toString().padStart(2, "0")}</span>
              </div>

              <p className="text-xs text-center text-[var(--cc-text-tertiary)] max-w-[240px]">
                This QR is valid for 5 minutes. Ask the buyer to scan it to verify the exchange.
              </p>
            </>
          )}

          {state === "scanned" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <CheckCircle2 className="h-14 w-14 text-emerald-500" />
              <div className="text-center">
                <p className="font-bold text-[var(--cc-text-primary)]">QR Scanned!</p>
                <p className="text-sm text-[var(--cc-text-secondary)] mt-1">
                  The buyer has scanned the QR. Confirm the exchange to complete.
                </p>
              </div>
            </div>
          )}

          {state === "error" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="text-center">
                <p className="font-semibold text-[var(--cc-text-primary)] mb-1">Something went wrong</p>
                <p className="text-sm text-red-500">{error}</p>
              </div>
              <Button variant="outline" onClick={generateQR} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Regenerate QR
              </Button>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
