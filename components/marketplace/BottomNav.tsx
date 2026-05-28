"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusSquare, MessageCircle, User } from "lucide-react";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

const NAV_ITEMS = [
  { label: "Browse", href: APP_ROUTES.browse, icon: Home },
  { label: "Sell", href: APP_ROUTES.sell, icon: PlusSquare },
  { label: "Chats", href: APP_ROUTES.dashboardChats, icon: MessageCircle },
  { label: "Profile", href: APP_ROUTES.dashboardProfile, icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--cc-border-subtle)] bg-[var(--cc-surface)]/95 backdrop-blur-md pb-safe">
      <div className="flex items-center justify-around h-16">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          // Simple active check. Enhance later if dealing with sub-routes
          const isActive = pathname === href || pathname?.startsWith(`${href}/`);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                isActive
                  ? "text-[var(--cc-primary)]"
                  : "text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)]"
              )}
            >
              <Icon className={cn("h-6 w-6", isActive && "fill-current/10")} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
