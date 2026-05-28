"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketplaceStore } from "@/store/marketplace-store";
import { ListingCard } from "@/components/ui/ListingCard";
import { ListingCardSkeleton } from "@/components/skeletons/ListingCardSkeleton";
import {
  SlidersHorizontal, Search, X, ChevronDown, LayoutGrid,
  LayoutList, TrendingUp, Clock, ArrowUpDown, Package
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { ListingCategory, ProductCondition } from "@/types/enums";

const CATEGORIES = [
  { value: "all",           label: "All Items" },
  { value: "BOOKS",         label: "Books" },
  { value: "CALCULATORS",   label: "Calculators" },
  { value: "LAB_MATERIALS", label: "Lab Materials" },
  { value: "ELECTRONICS",   label: "Electronics" },
  { value: "CLOTHING",      label: "Clothing" },
  { value: "NOTES",         label: "Notes" },
  { value: "INSTRUMENTS",   label: "Instruments" },
  { value: "OTHER",         label: "Other" },
];

const CONDITIONS = [
  { value: "NEW",      label: "New",       color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { value: "LIKE_NEW", label: "Like New",  color: "text-blue-600 bg-blue-50 border-blue-200" },
  { value: "GOOD",     label: "Good",      color: "text-amber-600 bg-amber-50 border-amber-200" },
  { value: "FAIR",     label: "Fair",      color: "text-orange-600 bg-orange-50 border-orange-200" },
  { value: "POOR",     label: "Poor",      color: "text-red-600 bg-red-50 border-red-200" },
];

const SORT_OPTIONS = [
  { value: "newest",    label: "Newest First",    icon: Clock },
  { value: "oldest",    label: "Oldest First",    icon: Clock },
  { value: "price_asc", label: "Price: Low-High", icon: TrendingUp },
  { value: "price_desc",label: "Price: High-Low", icon: TrendingUp },
];

interface RawListing {
  id: string;
  slug?: string | null;
  title: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  imageUrls?: string[];
  category: string;
  condition: string;
  status: string;
  seller: { id: string; name: string; avatar?: string | null; isVerified: boolean };
  createdAt: string;
}

export default function BrowsePage() {
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const { toggleSaved } = useMarketplaceStore();

  const [mounted,       setMounted]       = useState(false);
  const [isLoading,     setIsLoading]     = useState(true);
  const [listings,      setListings]      = useState<RawListing[]>([]);
  const [error,         setError]         = useState<string | null>(null);
  const [isFilterOpen,  setIsFilterOpen]  = useState(false);
  const [sortBy,        setSortBy]        = useState("newest");
  const [isSortOpen,    setIsSortOpen]    = useState(false);
  const [viewMode,      setViewMode]      = useState<"grid" | "list">("grid");
  const [searchInput,   setSearchInput]   = useState("");

  // Active filters
  const [activeCategory,  setActiveCategory]  = useState(searchParams.get("category") || "all");
  const [activeCondition, setActiveCondition] = useState<string | null>(null);
  const [minPrice,        setMinPrice]        = useState("");
  const [maxPrice,        setMaxPrice]        = useState("");
  const [searchQuery,     setSearchQuery]     = useState(searchParams.get("search") || "");

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setSearchInput(searchQuery); }, [searchQuery]);

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("limit", "80");
      if (searchQuery)     params.set("search", searchQuery);
      if (activeCategory && activeCategory !== "all") params.set("category", activeCategory);
      if (activeCondition) params.set("condition", activeCondition);

      const res = await fetch(`/api/listings?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setListings(data.listings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, activeCategory, activeCondition]);

  useEffect(() => {
    const t = setTimeout(fetchListings, 300);
    return () => clearTimeout(t);
  }, [fetchListings]);

  const filteredListings = useMemo(() => {
    let result = [...listings];
    if (minPrice) result = result.filter((l) => l.price >= Number(minPrice));
    if (maxPrice) result = result.filter((l) => l.price <= Number(maxPrice));
    switch (sortBy) {
      case "price_asc":  result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "oldest":     result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
      default:           result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return result;
  }, [listings, minPrice, maxPrice, sortBy]);

  const activeFilterCount = [
    activeCategory !== "all",
    !!activeCondition,
    !!minPrice,
    !!maxPrice,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setActiveCategory("all");
    setActiveCondition(null);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setSearchInput("");
  };

  if (!mounted) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="h-12 skeleton rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ListingCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Sticky Top Bar ─────────────────────────── */}
      <div className="sticky top-16 z-30 bg-[var(--cc-surface)]/95 backdrop-blur-md border-b border-[var(--cc-border-subtle)]">
        <div className="px-4 sm:px-6 py-3">
          {/* Row 1: Search + Actions */}
          <div className="flex items-center gap-3 mb-3">
            {/* Search */}
            <form
              onSubmit={(e) => { e.preventDefault(); setSearchQuery(searchInput); }}
              className="flex-1 flex items-center gap-2 px-3.5 py-2.5 bg-[var(--cc-bg-muted)] border border-[var(--cc-border-subtle)] rounded-xl hover:border-[var(--cc-border)] focus-within:border-[#D4A64F] focus-within:ring-2 focus-within:ring-[#D4A64F]/20 transition-all"
            >
              <Search className="h-4 w-4 text-[var(--cc-text-secondary)] shrink-0" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search listings..."
                className="flex-1 bg-transparent text-sm text-[var(--cc-text-primary)] placeholder:text-[var(--cc-text-disabled)] outline-none"
              />
              {searchInput && (
                <button type="button" onClick={() => { setSearchInput(""); setSearchQuery(""); }}>
                  <X className="h-3.5 w-3.5 text-[var(--cc-text-secondary)]" />
                </button>
              )}
            </form>

            {/* Filter btn */}
            <button
              onClick={() => setIsFilterOpen((v) => !v)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150",
                isFilterOpen || activeFilterCount > 0
                  ? "border-[#D4A64F] bg-[#D4A64F]/10 text-[#D4A64F]"
                  : "border-[var(--cc-border)] text-[var(--cc-text-secondary)] hover:border-[var(--cc-border-strong)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)]"
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:block">Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4A64F] text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen((v) => !v)}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[var(--cc-border)] text-sm font-medium text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)] transition-all duration-150"
              >
                <ArrowUpDown className="h-4 w-4" />
                {SORT_OPTIONS.find((s) => s.value === sortBy)?.label}
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isSortOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-[var(--cc-surface)] rounded-xl border border-[var(--cc-border-subtle)] shadow-xl overflow-hidden z-50"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors",
                          sortBy === opt.value
                            ? "bg-[#D4A64F]/10 text-[#D4A64F] font-medium"
                            : "text-[var(--cc-text-secondary)] hover:bg-[var(--cc-bg-muted)] hover:text-[var(--cc-text-primary)]"
                        )}
                      >
                        <opt.icon className="h-3.5 w-3.5" />
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View toggle */}
            <div className="hidden md:flex items-center border border-[var(--cc-border)] rounded-xl overflow-hidden">
              {(["grid", "list"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "p-2.5 transition-colors",
                    viewMode === mode
                      ? "bg-[#D4A64F]/10 text-[#D4A64F]"
                      : "text-[var(--cc-text-secondary)] hover:bg-[var(--cc-bg-muted)]"
                  )}
                >
                  {mode === "grid" ? <LayoutGrid className="h-4 w-4" /> : <LayoutList className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150",
                  activeCategory === cat.value
                    ? "bg-[#D4A64F] text-white border-[#D4A64F] shadow-sm"
                    : "border-[var(--cc-border)] text-[var(--cc-text-secondary)] hover:border-[#D4A64F]/50 hover:text-[#D4A64F] hover:bg-[#D4A64F]/5"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded filter panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-[var(--cc-border-subtle)] bg-[var(--cc-bg)]"
            >
              <div className="px-4 sm:px-6 py-4 flex flex-wrap gap-6">
                {/* Condition */}
                <div>
                  <p className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wide mb-2">Condition</p>
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setActiveCondition(activeCondition === c.value ? null : c.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150",
                          activeCondition === c.value ? c.color : "border-[var(--cc-border)] text-[var(--cc-text-secondary)] hover:border-[var(--cc-border-strong)]"
                        )}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <p className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wide mb-2">Price Range (₹)</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-24 px-3 py-1.5 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-surface)] text-sm text-[var(--cc-text-primary)] outline-none focus:border-[#D4A64F] transition-colors"
                    />
                    <span className="text-[var(--cc-text-disabled)] text-sm">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-24 px-3 py-1.5 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-surface)] text-sm text-[var(--cc-text-primary)] outline-none focus:border-[#D4A64F] transition-colors"
                    />
                  </div>
                </div>

                {/* Clear */}
                {activeFilterCount > 0 && (
                  <div className="flex items-end">
                    <button
                      onClick={clearAllFilters}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      <X className="h-3 w-3" />
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Main Content ───────────────────────────── */}
      <div className="flex-1 px-4 sm:px-6 py-6">
        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold text-[var(--cc-text-primary)]">
              {activeCategory !== "all"
                ? CATEGORIES.find((c) => c.value === activeCategory)?.label
                : "Campus Listings"}
            </h1>
            <p className="text-xs text-[var(--cc-text-secondary)] mt-0.5">
              {isLoading ? "Loading..." : `${filteredListings.length} result${filteredListings.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {activeCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4A64F]/10 text-[#D4A64F] text-xs font-medium border border-[#D4A64F]/20">
                  {CATEGORIES.find((c) => c.value === activeCategory)?.label}
                  <button onClick={() => setActiveCategory("all")}><X className="h-3 w-3" /></button>
                </span>
              )}
              {activeCondition && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4A64F]/10 text-[#D4A64F] text-xs font-medium border border-[#D4A64F]/20">
                  {CONDITIONS.find((c) => c.value === activeCondition)?.label}
                  <button onClick={() => setActiveCondition(null)}><X className="h-3 w-3" /></button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className={cn(
            "grid gap-3 sm:gap-4",
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              : "grid-cols-1"
          )}>
            {Array.from({ length: 12 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-lg font-bold text-[var(--cc-text-primary)] mb-2">Failed to load listings</h2>
            <p className="text-sm text-[var(--cc-text-secondary)] mb-6">{error}</p>
            <button
              onClick={fetchListings}
              className="px-5 py-2.5 rounded-xl bg-[var(--cc-primary)] text-white font-semibold text-sm hover:bg-[var(--cc-primary-hover)] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredListings.length > 0 ? (
          <motion.div
            layout
            className={cn(
              "grid gap-3 sm:gap-4",
              viewMode === "grid"
                ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                : "grid-cols-1 max-w-2xl"
            )}
          >
            <AnimatePresence>
              {filteredListings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <ListingCard
                    listing={{
                      id: listing.id,
                      slug: listing.slug || listing.id,
                      title: listing.title,
                      price: listing.price,
                      originalPrice: listing.originalPrice ?? undefined,
                      category: listing.category as ListingCategory,
                      condition: listing.condition as ProductCondition,
                      status: listing.status as "ACTIVE" | "SOLD" | "RESERVED" | "EXPIRED" | "DRAFT" | "REMOVED",
                      images: (() => {
                        const urls = (listing.imageUrls?.length ? listing.imageUrls : (listing.imageUrl ? [listing.imageUrl] : []));
                        return urls.map((url, idx) => ({ id: String(idx), url, alt: listing.title, isPrimary: idx === 0 }));
                      })(),
                      seller: {
                        id: listing.seller.id,
                        name: listing.seller.name,
                        isVerified: listing.seller.isVerified,
                        rating: 4.5,
                      },
                      saves: 0,
                      createdAt: listing.createdAt,
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl mb-6"
            >
              <Package className="h-16 w-16 text-[var(--cc-border)] mx-auto" />
            </motion.div>
            <h2 className="text-xl font-bold text-[var(--cc-text-primary)] mb-2">No listings found</h2>
            <p className="text-sm text-[var(--cc-text-secondary)] mb-8 max-w-xs">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search.`
                : "Nothing matches your current filters. Try adjusting them."}
            </p>
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64F] to-[#C8943C] text-white font-semibold text-sm hover:from-[#E5B95C] hover:to-[#D4A64F] transition-all duration-200"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
