"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  User,
  ArrowRightLeft,
  GraduationCap,
  Menu,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { APP_ROUTES } from "@/constants/routes";
import { MOCK_CURRENT_USER } from "@/lib/mock/user";
import { useState } from "react";

const NAV_ITEMS = [
  { href: APP_ROUTES.dashboard,         icon: LayoutDashboard, label: "Overview"  },
  { href: APP_ROUTES.dashboardListings, icon: Package,          label: "Listings"  },
  { href: APP_ROUTES.dashboardProfile,  icon: User,             label: "Profile"   },
  { href: APP_ROUTES.exchanges,         icon: ArrowRightLeft,   label: "Exchanges" },
];

export function MobileDashboardNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top bar for mobile */}
      <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] shrink-0 z-20">
        <Link href={APP_ROUTES.home} className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--cc-bg-inverse)] text-[var(--cc-primary)]">
            <GraduationCap className="h-3.5 w-3.5" />
          </span>
          <span className="font-bold text-[var(--cc-text-primary)] tracking-tight text-sm">
            Camp<span className="text-[var(--cc-primary)]">Cart</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <img
            src={MOCK_CURRENT_USER.avatar}
            alt={MOCK_CURRENT_USER.name}
            className="h-8 w-8 rounded-full object-cover border border-[var(--cc-border-subtle)]"
          />
        </div>
      </header>

      {/* Bottom tab bar for mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch border-t border-[var(--cc-border-subtle)] bg-[var(--cc-surface)]/95 backdrop-blur-md h-16">
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
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-[var(--cc-primary)]"
                  : "text-[var(--cc-text-secondary)]"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
              {isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 bg-[var(--cc-primary)] rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
