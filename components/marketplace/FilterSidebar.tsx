import { MarketplaceFilters } from "./MarketplaceFilters";
import { cn } from "@/utils/cn";

interface FilterSidebarProps {
  className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden lg:block w-64 shrink-0 border border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] rounded-xl p-5 sticky top-[88px] h-[calc(100vh-100px)] overflow-y-auto no-scrollbar",
        className
      )}
    >
      <MarketplaceFilters />
    </aside>
  );
}
