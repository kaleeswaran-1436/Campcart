"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  /* Sidebar */
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;

  /* Search */
  isSearchOpen: boolean;
  searchQuery: string;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchQuery: (q: string) => void;

  /* Filter panel */
  isFilterOpen: boolean;
  toggleFilter: () => void;

  /* Cart drawer */
  isCartOpen: boolean;
  toggleCart: () => void;

  /* Mobile nav */
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  closeMobileNav: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      /* Sidebar */
      isSidebarOpen: false,
      toggleSidebar: () =>
        set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      closeSidebar: () => set({ isSidebarOpen: false }),

      /* Search */
      isSearchOpen: false,
      searchQuery: "",
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false, searchQuery: "" }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      /* Filter panel */
      isFilterOpen: false,
      toggleFilter: () =>
        set((s) => ({ isFilterOpen: !s.isFilterOpen })),

      /* Cart drawer */
      isCartOpen: false,
      toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),

      /* Mobile nav */
      isMobileNavOpen: false,
      toggleMobileNav: () =>
        set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
      closeMobileNav: () => set({ isMobileNavOpen: false }),
    }),
    {
      name: "campcart-ui",
      // Only persist sidebar state across sessions
      partialize: (state) => ({ isSidebarOpen: state.isSidebarOpen }),
    }
  )
);
