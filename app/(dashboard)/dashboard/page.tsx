import type { Metadata } from "next";
import Link from "next/link";
import {
  Package, ArrowRightLeft, MessageCircle, Star,
  Plus, Search, ShieldCheck, TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed, type ActivityItem } from "@/components/dashboard/ActivityFeed";
import { Button } from "@/components/ui/Button";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { Badge } from "@/components/ui/Badge";
import { APP_ROUTES } from "@/constants/routes";
import { MOCK_CURRENT_USER } from "@/lib/mock/user";
import { MOCK_LISTINGS } from "@/lib/mock/listings";
import { MOCK_EXCHANGES, ACTIVE_EXCHANGES } from "@/lib/mock/exchanges";
import { ListingStatus } from "@/types/enums";

export const metadata: Metadata = { title: "Dashboard" };

/* ── Derive stats from mock data ────────────────────────────── */
const MY_LISTINGS = MOCK_LISTINGS.filter(
  (l) => l.seller.id === "seller-1" // treat seller-1 as "me" for demo
);
const ACTIVE_LISTINGS  = MY_LISTINGS.filter((l) => l.status === ListingStatus.ACTIVE);
const SOLD_LISTINGS    = MY_LISTINGS.filter((l) => l.status === ListingStatus.SOLD);
const RESERVED_LISTINGS = MY_LISTINGS.filter((l) => l.status === ListingStatus.RESERVED);

const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "a1",
    type: "message_received",
    title: "New message from Rahul S.",
    description: "\"Would you take 400 for it?\"",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    href: APP_ROUTES.chat("conv-1"),
  },
  {
    id: "a2",
    type: "exchange_started",
    title: "Exchange in progress",
    description: "Casio FX-991ES Plus — meetup at Library",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    href: APP_ROUTES.exchanges,
  },
  {
    id: "a3",
    type: "listing_reserved",
    title: "Item reserved",
    description: "Handwritten DSA Notes — reserved by Arjun K.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    href: APP_ROUTES.dashboardListings,
  },
  {
    id: "a4",
    type: "exchange_completed",
    title: "Exchange completed",
    description: "Engineering Mathematics Vol. 2 — sold for ₹350",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    href: APP_ROUTES.exchanges,
  },
  {
    id: "a5",
    type: "listing_created",
    title: "Listing posted",
    description: "Mini Drafter for Engineering Drawing",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    href: APP_ROUTES.dashboardListings,
  },
];

export default function DashboardPage() {
  const user = MOCK_CURRENT_USER;

  return (
    <div className="space-y-6">
      {/* ── Page header ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[var(--cc-text-primary)]">
              Hey, {user.name.split(" ")[0]} 👋
            </h1>
            <VerificationBadge status={user.verification} size="sm" />
          </div>
          <p className="text-sm text-[var(--cc-text-secondary)]">
            {user.department} · {user.college}
          </p>
        </div>

        <div className="flex gap-2">
          <Button href={APP_ROUTES.browse} variant="outline" size="sm" className="gap-1.5">
            <Search className="h-3.5 w-3.5" />
            Browse
          </Button>
          <Button href={APP_ROUTES.sell} variant="primary" size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Post Listing
          </Button>
        </div>
      </div>

      {/* ── Verification notice (if pending) ───────────────────── */}
      {user.verification === "pending" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--cc-warning-subtle)] border border-[var(--cc-warning-border)]">
          <ShieldCheck className="h-5 w-5 text-[var(--cc-warning)] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--cc-warning-fg)]">
              Verification in progress
            </p>
            <p className="text-xs text-[var(--cc-warning-fg)]/80 mt-0.5">
              Your student ID is being reviewed. You can still browse, but selling is limited until verified.
            </p>
          </div>
        </div>
      )}

      {/* ── Stats row ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Active Listings"
          value={ACTIVE_LISTINGS.length}
          subtext={`${RESERVED_LISTINGS.length} reserved`}
          icon={Package}
          iconColor="text-[var(--cc-primary)]"
          iconBg="bg-[var(--cc-primary-subtle)]"
        />
        <StatCard
          label="Completed Sales"
          value={SOLD_LISTINGS.length + 3}
          subtext="All time"
          icon={TrendingUp}
          iconColor="text-[var(--cc-success)]"
          iconBg="bg-[var(--cc-success-subtle)]"
          trend={{ value: "+2 this month", positive: true }}
        />
        <StatCard
          label="Active Exchanges"
          value={ACTIVE_EXCHANGES.length}
          subtext="QR sessions"
          icon={ArrowRightLeft}
          iconColor="text-[var(--cc-info)]"
          iconBg="bg-[var(--cc-info-subtle)]"
        />
        <StatCard
          label="Seller Rating"
          value={`${user.rating}★`}
          subtext={`${user.totalSales} sales`}
          icon={Star}
          iconColor="text-[var(--cc-warning)]"
          iconBg="bg-[var(--cc-warning-subtle)]"
        />
      </div>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity feed */}
        <div className="lg:col-span-2 surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[var(--cc-text-primary)]">
              Recent Activity
            </h2>
            <Link
              href={APP_ROUTES.chats}
              className="text-xs text-[var(--cc-primary)] hover:underline"
            >
              View messages →
            </Link>
          </div>
          <ActivityFeed items={ACTIVITY_ITEMS} />
        </div>

        {/* Quick actions + Active listings snapshot */}
        <div className="flex flex-col gap-4">
          {/* Quick actions */}
          <div className="surface p-4">
            <h2 className="text-sm font-semibold text-[var(--cc-text-primary)] mb-3">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New Listing", href: APP_ROUTES.sell,           icon: Plus },
                { label: "My Listings", href: APP_ROUTES.dashboardListings, icon: Package },
                { label: "Exchanges",   href: APP_ROUTES.exchanges,       icon: ArrowRightLeft },
                { label: "Messages",    href: APP_ROUTES.chats,           icon: MessageCircle },
              ].map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[var(--cc-border-subtle)] hover:border-[var(--cc-border)] hover:bg-[var(--cc-bg-muted)] transition-all text-center group"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cc-primary-subtle)] text-[var(--cc-primary)] group-hover:bg-[var(--cc-primary)] group-hover:text-white transition-colors">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-[var(--cc-text-secondary)]">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Active listings snapshot */}
          <div className="surface p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--cc-text-primary)]">
                Active Listings
              </h2>
              <Link
                href={APP_ROUTES.dashboardListings}
                className="text-xs text-[var(--cc-primary)] hover:underline"
              >
                View all →
              </Link>
            </div>

            {ACTIVE_LISTINGS.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-[var(--cc-text-secondary)]">No active listings yet</p>
                <Link
                  href={APP_ROUTES.sell}
                  className="text-xs text-[var(--cc-primary)] hover:underline mt-1 block"
                >
                  Post your first item →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {ACTIVE_LISTINGS.slice(0, 3).map((listing) => (
                  <Link
                    key={listing.id}
                    href={APP_ROUTES.listing(listing.slug)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--cc-bg-muted)] transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg overflow-hidden shrink-0 bg-[var(--cc-bg-muted)]">
                      <img
                        src={listing.images[0]?.url}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-[var(--cc-text-primary)] truncate">
                        {listing.title}
                      </p>
                      <p className="text-xs text-[var(--cc-primary)] font-semibold">
                        ₹{listing.price}
                      </p>
                    </div>
                    <Badge variant="mint" className="text-[10px]">Active</Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
