"use client";

import { useMarketplaceStore } from "@/store/marketplace-store";

import { ProductCondition, ListingStatus } from "@/types/enums";

export function MarketplaceFilters() {
  const { filters, setFilters, resetFilters } = useMarketplaceStore();

  const activeFiltersCount = Object.keys(filters).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--cc-text-primary)]">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="text-xs font-medium text-[var(--cc-primary)] hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Condition Filter */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wider">
          Condition
        </h4>
        <div className="space-y-2">
          {Object.values(ProductCondition).map((condition) => (
            <label key={condition} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="condition"
                value={condition}
                checked={filters.condition === condition}
                onChange={() => setFilters({ condition })}
                className="h-4 w-4 rounded-full border-[var(--cc-border)] accent-[var(--cc-primary)] bg-[var(--cc-surface-alt)]"
              />
              <span className="text-sm text-[var(--cc-text-primary)] group-hover:text-[var(--cc-primary)] transition-colors capitalize">
                {condition.replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wider">
          Price Range
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) =>
              setFilters({ minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full h-9 rounded-md border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] px-3 text-sm text-[var(--cc-text-primary)] placeholder:text-[var(--cc-text-muted)] focus:border-[var(--cc-primary)] focus:ring-1 focus:ring-[var(--cc-primary)] outline-none"
          />
          <span className="text-[var(--cc-text-disabled)]">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              setFilters({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full h-9 rounded-md border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] px-3 text-sm text-[var(--cc-text-primary)] placeholder:text-[var(--cc-text-muted)] focus:border-[var(--cc-primary)] focus:ring-1 focus:ring-[var(--cc-primary)] outline-none"
          />
        </div>
      </div>

      {/* Availability Status */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wider">
          Availability
        </h4>
        <div className="space-y-2">
          {[ListingStatus.ACTIVE, ListingStatus.SOLD].map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="status"
                value={status}
                checked={filters.status === status}
                onChange={() => setFilters({ status })}
                className="h-4 w-4 rounded-full border-[var(--cc-border)] accent-[var(--cc-primary)] bg-[var(--cc-surface-alt)]"
              />
              <span className="text-sm text-[var(--cc-text-primary)] group-hover:text-[var(--cc-primary)] transition-colors capitalize">
                {status} Only
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
