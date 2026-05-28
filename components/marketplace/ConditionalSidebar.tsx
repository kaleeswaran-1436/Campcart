"use client";

import { usePathname } from "next/navigation";
import { FilterSidebar } from "./FilterSidebar";

export function ConditionalSidebar() {
  const pathname = usePathname();
  
  // Hide sidebar on sell flow or specific focused pages
  if (pathname === "/sell" || pathname.startsWith("/sell/")) {
    return null;
  }
  
  return <FilterSidebar />;
}
