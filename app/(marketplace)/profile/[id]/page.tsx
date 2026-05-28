import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, MessageCircle, Package, Star } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileListingsGrid } from "@/components/profile/ProfileListingsGrid";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/routes";
import { MOCK_USERS, MOCK_CURRENT_USER } from "@/lib/mock/user";
import { MOCK_LISTING_PREVIEWS } from "@/lib/mock/listings";

// Merge current user into the lookup map for self-profile
const ALL_USERS: Record<string, typeof MOCK_CURRENT_USER> = {
  [MOCK_CURRENT_USER.id]: MOCK_CURRENT_USER,
  ...(Object.fromEntries(
    Object.entries(MOCK_USERS).map(([k, v]) => [k, v as typeof MOCK_CURRENT_USER])
  )),
};

// Map user IDs to their seller IDs in mock listings
const USER_TO_SELLER_MAP: Record<string, string> = {
  [MOCK_CURRENT_USER.id]: "seller-1",
  "seller-1": "seller-1",
  "seller-2": "seller-2",
  "seller-3": "seller-3",
};

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const user = ALL_USERS[id];
  if (!user) return { title: "Profile Not Found" };
  return {
    title: `${user.name} | CampCart`,
    description: `${user.name}'s verified student profile on CampCart — ${user.totalSales} items sold.`,
  };
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = ALL_USERS[id];
  if (!user) return notFound();

  const isOwn = id === MOCK_CURRENT_USER.id;
  const sellerId = USER_TO_SELLER_MAP[id] ?? id;

  // Get this user's active listings
  const userListings = MOCK_LISTING_PREVIEWS.filter(
    (l) => l.seller.id === sellerId && l.status === "ACTIVE"
  );

  return (
    <div className="min-h-screen bg-[var(--cc-bg)]">
      {/* Simple top nav */}
      <header className="sticky top-0 z-30 border-b border-[var(--cc-border-subtle)] bg-[var(--cc-surface)]/95 backdrop-blur-sm">
        <div className="container-cc flex h-14 items-center gap-3">
          <Link
            href={APP_ROUTES.browse}
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Browse
          </Link>
          <span className="text-[var(--cc-border)] text-sm">·</span>
          <p className="text-sm font-semibold text-[var(--cc-text-primary)] truncate">
            {user.name}
          </p>
        </div>
      </header>

      <main className="container-cc py-6 sm:py-8 max-w-3xl space-y-6">
        {/* Profile header card */}
        <ProfileHeader user={user} isOwn={isOwn} />

        {/* Action buttons (non-own) */}
        {!isOwn && (
          <div className="flex gap-3">
            <Button
              href={APP_ROUTES.chats}
              variant="primary"
              size="md"
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Send Message
            </Button>
            <Button
              href={APP_ROUTES.browse}
              variant="outline"
              size="md"
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              View All Listings
            </Button>
          </div>
        )}

        {/* Own profile: quick link to dashboard */}
        {isOwn && (
          <div className="flex gap-3">
            <Button
              href={APP_ROUTES.dashboard}
              variant="primary"
              size="md"
              className="gap-2"
            >
              Go to Dashboard →
            </Button>
            <Button
              href={APP_ROUTES.sell}
              variant="outline"
              size="md"
            >
              Post Listing
            </Button>
          </div>
        )}

        {/* Seller trust indicators */}
        {!isOwn && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                label: "Response rate",
                value: "95%",
                sub: "Responds quickly",
                star: true,
              },
              {
                label: "Completed sales",
                value: String(user.totalSales ?? 0),
                sub: "Verified exchanges",
                star: false,
              },
              {
                label: "Seller rating",
                value: `${user.rating ?? "—"}★`,
                sub: "From buyers",
                star: false,
              },
            ].map(({ label, value, sub, star }) => (
              <div
                key={label}
                className="surface p-4 text-center"
              >
                <p className="text-lg font-bold text-[var(--cc-text-primary)]">{value}</p>
                <p className="text-xs font-medium text-[var(--cc-text-primary)] mt-0.5">{label}</p>
                <p className="text-[10px] text-[var(--cc-text-disabled)] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* Active listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-[var(--cc-text-primary)] flex items-center gap-2">
              <Package className="h-4 w-4 text-[var(--cc-primary)]" />
              {isOwn ? "My Listings" : `${user.name.split(" ")[0]}'s Listings`}
              {userListings.length > 0 && (
                <span className="text-xs font-normal text-[var(--cc-text-secondary)]">
                  ({userListings.length} active)
                </span>
              )}
            </h2>
            {isOwn && userListings.length > 0 && (
              <Link
                href={APP_ROUTES.dashboardListings}
                className="text-xs text-[var(--cc-primary)] hover:underline"
              >
                Manage →
              </Link>
            )}
          </div>

          {userListings.length > 0 ? (
            <ProfileListingsGrid listings={userListings} />
          ) : (
            <div className="surface flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-8 w-8 text-[var(--cc-text-disabled)] mb-3" />
              <p className="text-sm font-medium text-[var(--cc-text-secondary)]">
                No active listings
              </p>
              {isOwn && (
                <Link
                  href={APP_ROUTES.sell}
                  className="text-sm text-[var(--cc-primary)] hover:underline mt-2"
                >
                  Post your first item →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Reviews placeholder */}
        {!isOwn && user.totalSales && user.totalSales > 0 && (
          <div>
            <h2 className="text-base font-semibold text-[var(--cc-text-primary)] mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-[var(--cc-warning)]" />
              Buyer Reviews
            </h2>
            <div className="space-y-3">
              {[
                {
                  reviewer: "Arjun K.",
                  avatar: "https://i.pravatar.cc/32?u=user4",
                  rating: 5,
                  comment: "Very smooth exchange. Item exactly as described!",
                  date: "3 days ago",
                },
                {
                  reviewer: "Sneha R.",
                  avatar: "https://i.pravatar.cc/32?u=user5",
                  rating: 4,
                  comment: "Good seller, quick response. Slight delay in meeting but overall great.",
                  date: "1 week ago",
                },
              ].map(({ reviewer, avatar, rating, comment, date }) => (
                <div
                  key={reviewer}
                  className="surface p-4 flex items-start gap-3"
                >
                  <img
                    src={avatar}
                    alt={reviewer}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-[var(--cc-text-primary)]">
                        {reviewer}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < rating ? "text-[var(--cc-warning)] fill-current" : "text-[var(--cc-border)]"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--cc-text-secondary)] leading-relaxed">
                      {comment}
                    </p>
                    <p className="text-xs text-[var(--cc-text-disabled)] mt-1">{date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
