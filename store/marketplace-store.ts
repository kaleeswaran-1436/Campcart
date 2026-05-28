"use client";

import { create } from "zustand";
import type { ListingCategory, SortOption } from "@/types/enums";
import type { ListingFilters } from "@/types/listing";

interface MarketplaceState {
  /* Filters */
  filters: ListingFilters;
  sort: SortOption;
  page: number;
  pageSize: number;

  /* Active category (tab/pill nav) */
  activeCategory: ListingCategory | "all";

  /* Search */
  searchQuery: string;

  /* Saved/bookmarked listing IDs (client-side optimistic) */
  savedListingIds: Set<string>;

  /* Actions */
  setFilters: (filters: Partial<ListingFilters>) => void;
  resetFilters: () => void;
  setSort: (sort: SortOption) => void;
  setPage: (page: number) => void;
  setActiveCategory: (cat: ListingCategory | "all") => void;
  setSearchQuery: (q: string) => void;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
}

const DEFAULT_FILTERS: ListingFilters = {};

export const useMarketplaceStore = create<MarketplaceState>()((set, get) => ({
  filters:        DEFAULT_FILTERS,
  sort:           "newest",
  page:           1,
  pageSize:       20,
  activeCategory: "all",
  searchQuery:    "",
  savedListingIds: new Set<string>(),

  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial }, page: 1 })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS, page: 1, searchQuery: "", activeCategory: "all" }),

  setSort: (sort) => set({ sort, page: 1 }),

  setPage: (page) => set({ page }),

  setActiveCategory: (activeCategory) =>
    set((s) => ({
      activeCategory,
      filters: {
        ...s.filters,
        category: activeCategory === "all" ? undefined : activeCategory,
      },
      page: 1,
    })),

  setSearchQuery: (searchQuery) =>
    set((s) => ({ searchQuery, filters: { ...s.filters, query: searchQuery }, page: 1 })),

  toggleSaved: (id) =>
    set((s) => {
      const next = new Set(s.savedListingIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { savedListingIds: next };
    }),

  isSaved: (id) => get().savedListingIds.has(id),
}));
