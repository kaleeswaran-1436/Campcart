import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: { default: "Auth | CampCart", template: "%s | CampCart" },
};

/**
 * Auth layout — minimal, centered card, no main nav/footer.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--cc-bg)] flex flex-col">
      {/* Minimal top bar */}
      <header className="h-14 flex items-center px-4 border-b border-[var(--cc-border-subtle)] bg-[var(--cc-surface)]">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--cc-bg-inverse)] text-[var(--cc-primary)] transition-transform group-hover:scale-105">
            <GraduationCap className="h-3.5 w-3.5" />
          </span>
          <span className="font-semibold text-[var(--cc-text-primary)] tracking-tight">
            Camp<span className="text-[var(--cc-primary)]">Cart</span>
          </span>
        </Link>
      </header>

      {/* Centred card area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-[var(--cc-text-secondary)]">
          © {new Date().getFullYear()} CampCart · For verified students only
        </p>
      </footer>
    </div>
  );
}
