import Link from "next/link";
import { GraduationCap, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/routes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | CampCart",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

/**
 * Custom 404 — shown when a route doesn't match.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cc-bg)] p-4">
      <div className="max-w-md w-full text-center">
        {/* Big 404 */}
        <div className="mb-6 relative inline-block">
          <span className="text-[8rem] font-black text-[var(--cc-border)] leading-none select-none">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--cc-surface)] border border-[var(--cc-border)] shadow-[var(--cc-shadow-md)] text-[var(--cc-primary)]">
              <GraduationCap className="h-7 w-7" />
            </span>
          </span>
        </div>

        <h1 className="text-2xl font-bold text-[var(--cc-text-primary)] mb-2">
          Page not found
        </h1>
        <p className="text-sm text-[var(--cc-text-secondary)] mb-8 leading-relaxed">
          This page doesn't exist or was removed. Maybe the listing was sold,
          or the link is broken.
        </p>

        {/* Quick links */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button href={APP_ROUTES.browse} variant="primary" size="md" className="gap-2">
            <Search className="h-4 w-4" />
            Browse Listings
          </Button>
          <Button href={APP_ROUTES.home} variant="outline" size="md" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        {/* Quick category links */}
        <div className="flex flex-wrap justify-center gap-2">
          {["Books", "Calculators", "Lab Materials", "Notes"].map((cat) => (
            <Link
              key={cat}
              href={APP_ROUTES.category(cat.toLowerCase().replace(" ", "-"))}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--cc-border)] text-[var(--cc-text-secondary)] hover:border-[var(--cc-border-focus)] hover:text-[var(--cc-text-primary)] transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
