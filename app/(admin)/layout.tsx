import type { Metadata } from "next";
import { LayoutDashboard, Users, Package, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { APP_ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: { default: "Admin | CampCart", template: "%s — Admin | CampCart" },
  robots: { index: false, follow: false },
};

const ADMIN_NAV = [
  { label: "Dashboard",  href: APP_ROUTES.admin,           icon: LayoutDashboard },
  { label: "Users",      href: APP_ROUTES.adminUsers,       icon: Users },
  { label: "Listings",   href: APP_ROUTES.adminListings,    icon: Package },
  { label: "Moderation", href: APP_ROUTES.adminModeration,  icon: ShieldCheck },
];

/**
 * Admin layout — sidebar + header.
 * Protected — middleware will redirect non-admins (wire up when auth is ready).
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--cc-bg)] flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-56 border-r border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] shrink-0 pt-4">
          <nav className="px-3 space-y-0.5">
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  "text-[var(--cc-text-secondary)] hover:bg-[var(--cc-bg-muted)] hover:text-[var(--cc-text-primary)]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <Container className="py-6">{children}</Container>
        </main>
      </div>
    </div>
  );
}
