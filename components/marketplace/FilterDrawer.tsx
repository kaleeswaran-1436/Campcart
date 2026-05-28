"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { MarketplaceFilters } from "./MarketplaceFilters";
import { useMarketplaceStore } from "@/store/marketplace-store";

export function FilterDrawer() {
  const [open, setOpen] = useState(false);
  const { filters } = useMarketplaceStore();
  
  const filterCount = Object.keys(filters).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] px-4 py-1.5 text-sm font-medium text-[var(--cc-text-primary)] hover:border-[var(--cc-border)] transition-colors lg:hidden shrink-0"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {filterCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--cc-primary)] text-[10px] text-white">
            {filterCount}
          </span>
        )}
      </button>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        side="bottom"
        title="Filters"
      >
        <MarketplaceFilters />
        
        {/* Mobile quick apply button */}
        <div className="mt-6 pt-4 border-t border-[var(--cc-border-subtle)]">
          <button
            onClick={() => setOpen(false)}
            className="w-full rounded-lg bg-[var(--cc-primary)] px-4 py-2.5 text-sm font-bold text-white shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </Drawer>
    </>
  );
}
