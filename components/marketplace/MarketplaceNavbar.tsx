"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, GraduationCap, PlusCircle, User, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/routes";
import { useMarketplaceStore } from "@/store/marketplace-store";


export function MarketplaceNavbar() {
  const { searchQuery, setSearchQuery } = useMarketplaceStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync local search with store when store changes (e.g., reset filters)
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce the local search input before pushing to Zustand
  // To avoid writing a new hook right now, we can implement inline debouncing via useEffect
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localSearch, searchQuery, setSearchQuery]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--cc-border-subtle)] bg-[var(--cc-surface)]/95 backdrop-blur-md">
      <div className="container-cc flex h-14 sm:h-16 items-center gap-4">
        {/* Logo */}
        <Link href={APP_ROUTES.home} className="hidden sm:flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--cc-bg-inverse)] text-[var(--cc-primary)]">
            <GraduationCap className="h-4 w-4" />
          </span>
          <span className="font-bold text-[var(--cc-text-primary)] tracking-tight text-lg">
            Camp<span className="text-[var(--cc-primary)]">Cart</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--cc-text-muted)] group-focus-within:text-[var(--cc-primary)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search items, textbooks..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full h-10 rounded-full border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] pl-10 pr-10 text-sm text-[var(--cc-text-primary)] placeholder:text-[var(--cc-text-muted)] focus:border-[var(--cc-primary)] focus:bg-[var(--cc-surface)] focus:ring-1 focus:ring-[var(--cc-primary)] outline-none transition-all"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch("")}
              className="absolute inset-y-0 right-3 flex items-center"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 text-[var(--cc-text-muted)] hover:text-[var(--cc-text-primary)]" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link href={APP_ROUTES.dashboard} className="relative p-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-surface-alt)] rounded-full transition-colors hidden sm:flex">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[var(--cc-surface)]" />
          </Link>

          <Link href={APP_ROUTES.dashboardProfile} className="p-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-surface-alt)] rounded-full transition-colors hidden sm:flex">
            <User className="h-5 w-5" />
          </Link>

          <Button href={APP_ROUTES.sell} variant="primary" size="sm" className="hidden sm:flex rounded-full gap-1.5 shadow-sm">
            <PlusCircle className="h-4 w-4" />
            Sell Item
          </Button>
        </div>
      </div>
    </header>
  );
}
