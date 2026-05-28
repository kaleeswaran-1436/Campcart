"use client";

import { useEffect, useRef, useState } from "react";
import { X, Loader2, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface QRScannerViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scannerId: string; // The current user (must be buyer)
  onSuccess: (transactionId: string) => void;
}

type ScannerState = "requesting" | "scanning" | "verifying" | "success" | "error";

export function QRScannerView({ open, onOpenChange, scannerId, onSuccess }: QRScannerViewProps) {
  const [state, setState] = useState<ScannerState>("requesting");
  const [error, setError] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const scannerRef = useRef<{ clear: () => void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasScanned = useRef(false);

  useEffect(() => {
    if (!open) {
      scannerRef.current?.clear();
      scannerRef.current = null;
      hasScanned.current = false;
      setState("requesting");
      setError(null);
      setTransactionId(null);
      return;
    }

    let destroyed = false;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (destroyed || !containerRef.current) return;

        const html5QrCode = new Html5Qrcode("cc-qr-scanner-region");
        scannerRef.current = html5QrCode;
        setState("scanning");

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            if (hasScanned.current) return;
            hasScanned.current = true;

            setState("verifying");
            await html5QrCode.stop();

            try {
              const res = await fetch("/api/transactions/qr/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ signedToken: decodedText, scannerId }),
              });

              const data = await res.json();

              if (!res.ok) throw new Error(data.error || "Verification failed");

              setTransactionId(data.transactionId);
              setState("success");
              onSuccess(data.transactionId);
            } catch (err) {
              const msg = err instanceof Error ? err.message : "QR verification failed";
              setError(msg);
              setState("error");
              hasScanned.current = false;
            }
          },
          undefined // error callback — we intentionally suppress per-frame errors
        );
      } catch (err) {
        if (!destroyed) {
          const msg = err instanceof Error ? err.message : "Camera access denied";
          setError(msg.includes("NotAllowed") ? "Camera permission denied. Please allow camera access." : msg);
          setState("error");
        }
      }
    };

    startScanner();

    return () => {
      destroyed = true;
      scannerRef.current?.clear();
    };
  }, [open, scannerId, onSuccess]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <div>
          <h2 className="font-bold text-white text-lg">Scan Exchange QR</h2>
          <p className="text-xs text-white/60 mt-0.5">Point camera at the seller&apos;s QR code</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Scanner area */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {state === "scanning" && (
          <>
            {/* Viewfinder overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <div className="relative z-10 w-[260px] h-[260px] rounded-2xl overflow-hidden ring-2 ring-white/30">
              {/* Scanning animation line */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--cc-primary)] to-transparent animate-[scan_2s_ease-in-out_infinite]" />
            </div>
            {/* Corner brackets */}
            <div className="absolute z-10 w-[280px] h-[280px] pointer-events-none">
              {["top-0 left-0 border-t-2 border-l-2 rounded-tl-xl", "top-0 right-0 border-t-2 border-r-2 rounded-tr-xl", "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl", "bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl"].map((cls, i) => (
                <div key={i} className={`absolute w-6 h-6 border-white/80 ${cls}`} />
              ))}
            </div>
          </>
        )}

        {/* Html5Qrcode mount target */}
        <div id="cc-qr-scanner-region" ref={containerRef} className="w-full h-full absolute inset-0" />

        {state === "requesting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <Camera className="h-16 w-16 text-white/40" />
            <div className="flex items-center gap-2 text-white/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Requesting camera access...</span>
            </div>
          </div>
        )}

        {state === "verifying" && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-[var(--cc-primary)] animate-spin" />
            <span className="text-white font-medium">Verifying QR code...</span>
          </div>
        )}

        {state === "success" && (
          <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center gap-4 p-6">
            <CheckCircle2 className="h-16 w-16 text-emerald-400" />
            <div className="text-center">
              <p className="text-white font-bold text-xl">QR Verified!</p>
              <p className="text-emerald-300 text-sm mt-2">
                Transaction verified. Both parties must now confirm the exchange.
              </p>
              {transactionId && (
                <p className="text-white/40 text-xs mt-2 font-mono truncate">ID: {transactionId}</p>
              )}
            </div>
            <Button
              variant="primary"
              onClick={() => onOpenChange(false)}
              className="mt-2"
            >
              Continue to Confirm
            </Button>
          </div>
        )}

        {state === "error" && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 p-6">
            <AlertCircle className="h-12 w-12 text-red-400" />
            <div className="text-center">
              <p className="text-white font-semibold">Scan Failed</p>
              <p className="text-red-300 text-sm mt-1">{error}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setError(null);
                hasScanned.current = false;
                setState("scanning");
              }}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Scan animation keyframes */}
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(240px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
