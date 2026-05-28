"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  User,
  ArrowRightLeft,
  Settings,
  LogOut,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_ROUTES } from "@/constants/routes";
import { MOCK_CURRENT_USER } from "@/lib/mock/user";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

const NAV_ITEMS = [
  { href: APP_ROUTES.dashboard,           icon: LayoutDashboard, label: "Overview"     },
  { href: APP_ROUTES.dashboardListings,   icon: Package,          label: "My Listings"  },
  { href: APP_ROUTES.dashboardProfile,    icon: User,             label: "Profile"      },
  { href: APP_ROUTES.exchanges,           icon: ArrowRightLeft,   label: "Exchanges"    },
  { href: APP_ROUTES.dashboardSettings,   icon: Settings,         label: "Settings"     },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 lg:w-60 shrink-0 border-r border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-[var(--cc-border-subtle)]">
        <Link href={APP_ROUTES.home} className="flex items-center gap-2 group">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--cc-bg-inverse)] text-[var(--cc-primary)]">
            <GraduationCap className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-[var(--cc-text-primary)] tracking-tight text-sm">
            Camp<span className="text-[var(--cc-primary)]">Cart</span>
          </span>
        </Link>
      </div>

      {/* User pill */}
      <div className="px-4 py-3 border-b border-[var(--cc-border-subtle)]">
        <div className="flex items-center gap-3">
          <img
            src={MOCK_CURRENT_USER.avatar}
            alt={MOCK_CURRENT_USER.name}
            className="h-8 w-8 rounded-full object-cover border border-[var(--cc-border-subtle)]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-[var(--cc-text-primary)] truncate">
                {MOCK_CURRENT_USER.name}
              </p>
              <VerificationBadge status={MOCK_CURRENT_USER.verification} size="xs" />
            </div>
            <p className="text-[10px] text-[var(--cc-text-secondary)] truncate">
              {MOCK_CURRENT_USER.department?.split(" ")[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === APP_ROUTES.dashboard
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[var(--cc-primary-subtle)] text-[var(--cc-primary)] border border-[var(--cc-primary)]/20"
                  : "text-[var(--cc-text-secondary)] hover:bg-[var(--cc-bg-muted)] hover:text-[var(--cc-text-primary)]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {isActive && <ChevronRight className="h-3 w-3 ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-3 border-t border-[var(--cc-border-subtle)] space-y-0.5">
        <Link
          href={APP_ROUTES.browse}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--cc-text-secondary)] hover:bg-[var(--cc-bg-muted)] hover:text-[var(--cc-text-primary)] transition-colors"
        >
          <GraduationCap className="h-4 w-4" />
          Back to Marketplace
        </Link>
        <button
          type="button"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--cc-error)] hover:bg-[var(--cc-error-subtle)] transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
