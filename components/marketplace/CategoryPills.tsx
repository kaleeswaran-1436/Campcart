"use client";

import { useMarketplaceStore } from "@/store/marketplace-store";
import { ListingCategory } from "@/types/enums";
import { cn } from "@/utils/cn";

const CATEGORIES: Array<{ id: ListingCategory | "all"; label: string }> = [
  { id: "all", label: "All Items" },
  { id: ListingCategory.BOOKS, label: "Books" },
  { id: ListingCategory.CALCULATORS, label: "Calculators" },
  { id: ListingCategory.NOTES, label: "Notes" },
  { id: ListingCategory.LAB_MATERIALS, label: "Lab Materials" },
  { id: ListingCategory.ELECTRONICS, label: "Electronics" },
  { id: ListingCategory.STATIONERY, label: "Stationery" },
];

export function CategoryPills() {
  const { activeCategory, setActiveCategory } = useMarketplaceStore();

  return (
    <div className="w-full overflow-x-auto no-scrollbar border-b border-[var(--cc-border-subtle)] bg-[var(--cc-surface)]">
      <div className="container-cc py-3 flex items-center gap-2">
        {CATEGORIES.map(({ id, label }) => {
          const isActive = activeCategory === id;
          return (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors border",
                isActive
                  ? "bg-[var(--cc-primary)] text-white border-[var(--cc-primary)] shadow-sm"
                  : "bg-[var(--cc-surface-alt)] text-[var(--cc-text-secondary)] border-[var(--cc-border-subtle)] hover:border-[var(--cc-border)] hover:text-[var(--cc-text-primary)]"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
