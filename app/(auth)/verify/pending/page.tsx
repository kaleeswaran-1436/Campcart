import Link from "next/link";
import type { Metadata } from "next";
import { Clock, CheckCircle2, ShieldCheck, Bell, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/ui/AuthCard";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/routes";
import { generateMetadata as genMeta } from "@/lib/seo/metadata";

export const metadata: Metadata = genMeta({
  title: "Verification Pending",
  description: "Your student ID is under review. We'll notify you once it's approved.",
  canonicalPath: "/verify/pending",
  noIndex: true,
});

const REVIEW_STEPS = [
  { label: "ID Uploaded",       done: true,  Icon: CheckCircle2 },
  { label: "Under Review",      done: false, Icon: Clock },
  { label: "Access Granted",    done: false, Icon: ShieldCheck },
];

export default function VerifyPendingPage() {
  return (
    <AuthCard
      title="Under Review"
      subtitle="Your student ID is being verified"
      showLogo={true}
    >
      {/* Animated clock icon */}
      <div className="flex justify-center mb-6">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping opacity-60" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/15 border-2 border-amber-500/30">
            <Clock className="h-9 w-9 text-amber-400" />
          </span>
        </div>
      </div>

      {/* Progress steps */}
      <div className="space-y-3 mb-6">
        {REVIEW_STEPS.map(({ label, done, Icon }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] px-4 py-3"
          >
            <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full
              ${done ? "bg-emerald-500/20 border border-emerald-500/40" : "bg-[var(--cc-surface)] border border-[var(--cc-border-subtle)]"}`}>
              <Icon className={`h-4 w-4 ${done ? "text-emerald-400" : "text-[var(--cc-text-muted)]"}`} />
            </span>
            <span className={`text-sm font-medium ${done ? "text-[var(--cc-text-primary)]" : "text-[var(--cc-text-muted)]"}`}>
              {label}
            </span>
            {i === 1 && (
              <span className="ml-auto text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full px-2 py-0.5 font-medium">
                In progress
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] p-4 space-y-3 text-sm mb-6">
        <div className="flex items-center gap-2 text-[var(--cc-text-secondary)]">
          <Bell className="h-4 w-4 text-[var(--cc-honey)] flex-shrink-0" />
          <span>You&apos;ll receive an email notification once verified</span>
        </div>
        <ul className="space-y-1.5 text-[var(--cc-text-muted)] text-xs list-disc list-inside">
          <li>Manual review typically takes <strong className="text-[var(--cc-text-secondary)]">2–24 hours</strong></li>
          <li>You can still browse listings while you wait</li>
          <li>Buying &amp; selling requires verified status</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-2">
        <Button
          href={APP_ROUTES.home}
          variant="primary"
          size="md"
          className="w-full"
          id="pending-browse-btn"
        >
          Browse Marketplace
          <ArrowRight className="h-4 w-4 ml-1.5" />
        </Button>
        <p className="text-center text-xs text-[var(--cc-text-muted)]">
          Wrong ID uploaded?{" "}
          <Link
            href={APP_ROUTES.verify ?? "/verify"}
            className="text-[var(--cc-honey)] hover:underline"
          >
            Re-upload
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
