"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Upload, ScanLine, CheckCircle2, AlertCircle,
  ImageIcon, RotateCcw, ArrowRight, RefreshCw,
  User, BookOpen, School, Hash,
} from "lucide-react";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { useAuthStore, type OcrExtractedData } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { cn } from "@/utils/cn";

const VERIFY_STEPS = ["Upload ID", "Confirm Details", "Submit"];

/* ── Confidence bar ─────────────────────────────────────────── */
function ConfidenceBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-[var(--cc-text-secondary)]">
        <span>Scan confidence</span>
        <span className={cn(pct >= 80 ? "text-emerald-400" : pct >= 50 ? "text-amber-400" : "text-red-400")}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[var(--cc-surface-alt)] overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── OCR field row ──────────────────────────────────────────── */
function OcrField({
  icon: Icon, label, value, id, onChange, editable,
}: {
  icon: typeof User; label: string; value: string;
  id: string; onChange: (v: string) => void; editable: boolean;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-medium text-[var(--cc-text-secondary)] uppercase tracking-wide"
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      {editable ? (
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-9 rounded-lg border px-3 text-sm",
            "bg-[var(--cc-surface-alt)] text-[var(--cc-text-primary)]",
            "border-[var(--cc-border-subtle)]",
            "focus:border-[var(--cc-honey)] focus:ring-2 focus:ring-[var(--cc-honey)]/20 outline-none",
            "transition-colors duration-150"
          )}
        />
      ) : (
        <p className="text-sm font-medium text-[var(--cc-text-primary)] py-1 px-1">
          {value || <span className="text-[var(--cc-text-muted)] italic">Not detected</span>}
        </p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   Verify ID Page
═══════════════════════════════════════════════════════════ */
export default function VerifyPage() {
  const router = useRouter();
  const { toast } = useNotificationStore();
  const {
    setVerificationStep, setOcrData, setIdCardPreview,
    setVerificationProgress, resetVerification,
    ocrData, idCardPreviewUrl, verificationProgress,
  } = useAuthStore();

  const [step, setStep] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(idCardPreviewUrl);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [editedOcr, setEditedOcr] = useState<OcrExtractedData>(
    ocrData ?? { name: "", rollNumber: "", department: "", college: "", batch: "", confidence: 0 }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── File handling ─────────────────────────────────────────── */
  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setScanError("Please upload an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setScanError("Image must be under 10 MB.");
      return;
    }

    setScanError(null);
    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    setIdCardPreview(url);

    // Simulate OCR scan
    simulateScan(file);
  }, [setIdCardPreview]);

  function simulateScan(_file: File) {
    setIsScanning(true);
    setVerificationStep("scanning");

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      const capped = Math.min(Math.round(progress), 95);
      setVerificationProgress(capped);
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setVerificationProgress(100);

      // Mock OCR result
      const mockOcr: OcrExtractedData = {
        name:        "Aditya Kumar",
        rollNumber:  "RA2211003010042",
        department:  "Computer Science & Engineering",
        college:     "SRM Institute of Science & Technology",
        batch:       "2022–2026",
        confidence:  88,
      };
      setOcrData(mockOcr);
      setEditedOcr(mockOcr);
      setVerificationStep("validating");
      setIsScanning(false);
      setStep(1);
    }, 3200);
  }

  /* ── Drag & drop ────────────────────────────────────────────── */
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  /* ── Submit verification ────────────────────────────────────── */
  async function submitVerification() {
    setIsSubmitting(true);
    try {
      // TODO: wire to authService.submitVerification(editedOcr)
      await new Promise((r) => setTimeout(r, 1400));
      setVerificationStep("pending");
      toast.success("ID submitted! We'll review it within 24 hours.");
      router.push("/verify/pending");
    } catch {
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ── Reset ──────────────────────────────────────────────────── */
  function handleReset() {
    resetVerification();
    setLocalPreview(null);
    setEditedOcr({ name: "", rollNumber: "", department: "", college: "", batch: "", confidence: 0 });
    setStep(0);
    setScanError(null);
  }

  return (
    <AuthCard
      title="Verify Your Student ID"
      subtitle="Upload your college ID card to get verified access"
      footer={
        <p>
          Need help?{" "}
          <Link href="/support" className="text-[var(--cc-honey)] hover:underline font-medium">
            Contact support
          </Link>
        </p>
      }
    >
      <StepIndicator steps={VERIFY_STEPS} currentStep={step} className="mb-6" />

      {/* ── Step 0 — Upload ─────────────────────────────────── */}
      {step === 0 && (
        <div className="space-y-4 animate-fade-in">
          {/* Guidelines */}
          <div className="rounded-lg border border-[var(--cc-honey)]/30 bg-[var(--cc-honey)]/5 px-4 py-3 text-sm text-[var(--cc-text-secondary)] space-y-1">
            <p className="font-medium text-[var(--cc-honey)]">Before you upload:</p>
            <ul className="space-y-0.5 list-disc list-inside text-xs">
              <li>Use your official college-issued ID card</li>
              <li>Ensure all text is clearly visible and in focus</li>
              <li>Accepted formats: JPG, PNG, WebP — max 10 MB</li>
            </ul>
          </div>

          {/* Drop zone */}
          {localPreview ? (
            <div className="relative rounded-xl border-2 border-[var(--cc-border-subtle)] overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={localPreview}
                alt="Uploaded ID card preview"
                className="w-full object-contain max-h-64"
              />
              <button
                type="button"
                onClick={handleReset}
                className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove uploaded image"
              >
                <RotateCcw className="h-6 w-6 text-white mr-2" />
                <span className="text-white font-medium text-sm">Change Image</span>
              </button>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload ID card — drop or click"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed",
                "h-52 cursor-pointer transition-all duration-200",
                isDragging
                  ? "border-[var(--cc-honey)] bg-[var(--cc-honey)]/5 scale-[1.01]"
                  : "border-[var(--cc-border-subtle)] hover:border-[var(--cc-honey)]/50 hover:bg-[var(--cc-honey)]/5"
              )}
            >
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                isDragging ? "bg-[var(--cc-honey)]/20" : "bg-[var(--cc-surface-alt)]"
              )}>
                <ImageIcon className={cn(
                  "h-6 w-6 transition-colors",
                  isDragging ? "text-[var(--cc-honey)]" : "text-[var(--cc-text-muted)]"
                )} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--cc-text-primary)]">
                  {isDragging ? "Drop your ID card here" : "Drop your ID card here"}
                </p>
                <p className="text-xs text-[var(--cc-text-muted)] mt-0.5">
                  or <span className="text-[var(--cc-honey)]">click to browse</span>
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-hidden="true"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) processFile(f);
            }}
          />

          {scanError && (
            <p className="flex items-center gap-1.5 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {scanError}
            </p>
          )}

          {/* Scanning progress */}
          {isScanning && (
            <div className="space-y-3 rounded-xl border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] p-4 animate-fade-in">
              <div className="flex items-center gap-2 text-sm text-[var(--cc-text-secondary)]">
                <ScanLine className="h-4 w-4 text-[var(--cc-honey)] animate-pulse" />
                <span>Scanning your ID card…</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--cc-surface)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[var(--cc-honey)] transition-all duration-500"
                  style={{ width: `${verificationProgress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--cc-text-muted)]">
                Extracting name, roll number, department…
              </p>
            </div>
          )}

          {/* Upload button (fallback for when no file selected yet) */}
          {!localPreview && !isScanning && (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              id="upload-id-btn"
              type="button"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select ID Card
            </Button>
          )}
        </div>
      )}

      {/* ── Step 1 — Confirm / Correct OCR ─────────────────── */}
      {step === 1 && editedOcr && (
        <div className="space-y-5 animate-fade-in">
          <div className="rounded-lg border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] p-3 flex items-start gap-3">
            {localPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={localPreview}
                alt="Your uploaded ID"
                className="h-16 w-24 object-cover rounded-lg border border-[var(--cc-border-subtle)] flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--cc-text-secondary)] mb-1">Scan complete</p>
              <ConfidenceBar pct={editedOcr.confidence} />
              {editedOcr.confidence < 60 && (
                <p className="text-xs text-amber-400 mt-2">
                  Low confidence — please correct any inaccurate fields below.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-[var(--cc-text-primary)]">
              Review & correct extracted details
            </p>

            <OcrField
              icon={User} label="Full Name" id="ocr-name"
              value={editedOcr.name ?? ""}
              onChange={(v) => setEditedOcr((p) => ({ ...p, name: v }))}
              editable
            />
            <OcrField
              icon={Hash} label="Roll Number" id="ocr-roll"
              value={editedOcr.rollNumber ?? ""}
              onChange={(v) => setEditedOcr((p) => ({ ...p, rollNumber: v }))}
              editable
            />
            <OcrField
              icon={BookOpen} label="Department" id="ocr-dept"
              value={editedOcr.department ?? ""}
              onChange={(v) => setEditedOcr((p) => ({ ...p, department: v }))}
              editable
            />
            <OcrField
              icon={School} label="College" id="ocr-college"
              value={editedOcr.college ?? ""}
              onChange={(v) => setEditedOcr((p) => ({ ...p, college: v }))}
              editable
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleReset}
              type="button"
              id="verify-reset-btn"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Re-upload
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={() => {
                setOcrData(editedOcr);
                setStep(2);
              }}
              type="button"
              id="verify-confirm-btn"
            >
              Looks Good
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2 — Final Review & Submit ─────────────────── */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-in">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>Your details are ready for submission</span>
          </div>

          {/* Summary card */}
          <div className="rounded-xl border border-[var(--cc-border-subtle)] divide-y divide-[var(--cc-border-subtle)] overflow-hidden">
            {[
              { label: "Full Name",   value: editedOcr.name },
              { label: "Roll Number", value: editedOcr.rollNumber },
              { label: "Department",  value: editedOcr.department },
              { label: "College",     value: editedOcr.college },
              { label: "Batch",       value: editedOcr.batch },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span className="text-[var(--cc-text-secondary)]">{label}</span>
                <span className="font-medium text-[var(--cc-text-primary)] text-right max-w-[60%] truncate">
                  {value || <span className="text-[var(--cc-text-muted)] italic">—</span>}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[var(--cc-text-muted)] text-center leading-relaxed">
            By submitting, you confirm this is your genuine college ID card.
            False submissions may result in permanent account suspension.
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setStep(1)}
              type="button"
              id="verify-back-btn"
            >
              Edit Details
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              loading={isSubmitting}
              onClick={submitVerification}
              id="verify-submit-btn"
              type="button"
            >
              {isSubmitting ? "Submitting…" : "Submit for Review"}
            </Button>
          </div>
        </div>
      )}
    </AuthCard>
  );
}
