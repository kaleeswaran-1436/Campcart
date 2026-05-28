import Link from "next/link";
import { GraduationCap, Search, ArrowLeft, Home } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | CampCart",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--cc-bg)] p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 */}
        <div className="relative inline-block mb-8">
          <span
            className="block text-[10rem] font-black leading-none select-none"
            style={{
              background: "linear-gradient(135deg, var(--cc-border) 0%, var(--cc-border-subtle) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4A64F] to-[#C8943C] text-white shadow-xl shadow-[#D4A64F]/25 animate-float">
              <GraduationCap className="h-8 w-8" />
            </span>
          </span>
        </div>

        <h1 className="text-2xl font-black text-[var(--cc-text-primary)] mb-3">
          Oops, nothing here!
        </h1>
        <p className="text-sm text-[var(--cc-text-secondary)] mb-8 leading-relaxed">
          This page doesn't exist or was removed.
          Maybe the listing was sold, or the link is broken.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/browse"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64F] to-[#C8943C] text-white font-semibold text-sm hover:from-[#E5B95C] hover:to-[#D4A64F] transition-all duration-200"
          >
            <Search className="h-4 w-4" />
            Browse Listings
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--cc-border)] text-[var(--cc-text-secondary)] font-semibold text-sm hover:bg-[var(--cc-bg-muted)] hover:text-[var(--cc-text-primary)] transition-all duration-150"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>

        {/* Category shortcuts */}
        <div className="flex flex-wrap justify-center gap-2">
          {["Books", "Calculators", "Lab Materials", "Electronics"].map((cat) => (
            <Link
              key={cat}
              href={`/browse?category=${cat.toUpperCase().replace(" ", "_")}`}
              className="text-xs px-3.5 py-1.5 rounded-full border border-[var(--cc-border)] text-[var(--cc-text-secondary)] hover:border-[#D4A64F] hover:text-[#D4A64F] transition-all duration-150"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
