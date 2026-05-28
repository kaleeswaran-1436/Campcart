import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightLeft, CheckCircle2, Clock,
  TrendingUp, ShieldCheck,
} from "lucide-react";
import { ExchangeCard } from "@/components/exchanges/ExchangeCard";
import { MOCK_EXCHANGES, ACTIVE_EXCHANGES, COMPLETED_EXCHANGES } from "@/lib/mock/exchanges";
import { ExchangeStatus } from "@/types/enums";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/layout/Container";
import { APP_ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Exchanges | CampCart",
  description: "Track your QR-based campus exchanges — in progress, confirmed, and completed.",
};

const CANCELLED = MOCK_EXCHANGES.filter(
  (e) => e.status === ExchangeStatus.CANCELLED
);

export default function ExchangesPage() {
  const totalCompleted = COMPLETED_EXCHANGES.length;
  const totalActive = ACTIVE_EXCHANGES.length;
  const totalValue = COMPLETED_EXCHANGES.reduce((s, e) => s + e.listingPrice, 0);

  return (
    <>
      <Header />
      <main className="flex-1 bg-[var(--cc-bg)]">
        <Container className="py-6 sm:py-8">
          {/* ── Page header ──────────────────────────────────── */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <ArrowRightLeft className="h-5 w-5 text-[var(--cc-primary)]" />
              <h1 className="text-xl font-bold text-[var(--cc-text-primary)]">My Exchanges</h1>
            </div>
            <p className="text-sm text-[var(--cc-text-secondary)]">
              Track your QR-secured campus item exchanges
            </p>
          </div>

          {/* ── Stats row ────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              {
                icon: Clock,
                label: "Active",
                value: totalActive,
                color: "text-[var(--cc-warning)]",
                bg: "bg-[var(--cc-warning-subtle)]",
              },
              {
                icon: CheckCircle2,
                label: "Completed",
                value: totalCompleted,
                color: "text-[var(--cc-success)]",
                bg: "bg-[var(--cc-success-subtle)]",
              },
              {
                icon: TrendingUp,
                label: "Total Value",
                value: `₹${totalValue}`,
                color: "text-[var(--cc-primary)]",
                bg: "bg-[var(--cc-primary-subtle)]",
              },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="surface p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                  </span>
                  <p className="text-xs text-[var(--cc-text-secondary)] font-medium">{label}</p>
                </div>
                <p className="text-xl font-bold text-[var(--cc-text-primary)]">{value}</p>
              </div>
            ))}
          </div>

          {/* ── Active exchanges ──────────────────────────────── */}
          {ACTIVE_EXCHANGES.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="status-dot status-dot--warning animate-pulse-soft" />
                <h2 className="text-sm font-semibold text-[var(--cc-text-primary)]">
                  Active ({ACTIVE_EXCHANGES.length})
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                {ACTIVE_EXCHANGES.map((exchange) => (
                  <ExchangeCard key={exchange.id} exchange={exchange} />
                ))}
              </div>
            </section>
          )}

          {/* ── QR How-it-works banner ────────────────────────── */}
          <div className="mb-6 rounded-xl bg-[var(--cc-bg-inverse)] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--cc-primary)] text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">QR-Secured Exchange</p>
              <p className="text-xs text-white/60 mt-0.5">
                When you're ready to meet, generate a QR code in the chat. The buyer scans it on-campus to confirm the handoff — no cash disputes, ever.
              </p>
            </div>
            <Link
              href={APP_ROUTES.chats}
              className="shrink-0 text-sm font-medium text-[var(--cc-primary)] hover:underline"
            >
              Go to Chats →
            </Link>
          </div>

          {/* ── Completed exchanges ───────────────────────────── */}
          {COMPLETED_EXCHANGES.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-semibold text-[var(--cc-text-primary)] mb-3">
                Completed ({COMPLETED_EXCHANGES.length})
              </h2>
              <div className="flex flex-col gap-3">
                {COMPLETED_EXCHANGES.map((exchange) => (
                  <ExchangeCard key={exchange.id} exchange={exchange} />
                ))}
              </div>
            </section>
          )}

          {/* ── Cancelled exchanges ───────────────────────────── */}
          {CANCELLED.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-[var(--cc-text-secondary)] mb-3">
                Cancelled ({CANCELLED.length})
              </h2>
              <div className="flex flex-col gap-3 opacity-70">
                {CANCELLED.map((exchange) => (
                  <ExchangeCard key={exchange.id} exchange={exchange} />
                ))}
              </div>
            </section>
          )}

          {/* ── Empty state ───────────────────────────────────── */}
          {MOCK_EXCHANGES.length === 0 && (
            <div className="surface flex flex-col items-center justify-center py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--cc-bg-muted)] mb-4">
                <ArrowRightLeft className="h-7 w-7 text-[var(--cc-text-disabled)]" />
              </span>
              <p className="font-semibold text-[var(--cc-text-primary)]">No exchanges yet</p>
              <p className="text-sm text-[var(--cc-text-secondary)] mt-1 mb-4">
                When you agree on a meetup in a chat, your exchange will appear here.
              </p>
              <Link
                href={APP_ROUTES.browse}
                className="text-sm font-medium text-[var(--cc-primary)] hover:underline"
              >
                Browse listings →
              </Link>
            </div>
          )}
        </Container>
      </main>
    </>
  );
}
