"use client";

import { useState, useEffect } from "react";

const BREAKPOINTS = {
  xs:  375,
  sm:  640,
  md:  768,
  lg:  1024,
  xl:  1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * SSR-safe hook that returns true when the viewport matches
 * the given min-width breakpoint.
 *
 * @example
 * const isDesktop = useMediaQuery("lg"); // true when width >= 1024px
 */
export function useMediaQuery(breakpoint: Breakpoint): boolean {
  const query = `(min-width: ${BREAKPOINTS[breakpoint]}px)`;

  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Returns the current active breakpoint name.
 *
 * @example
 * const bp = useBreakpoint(); // "md" | "lg" | etc.
 */
export function useBreakpoint(): Breakpoint {
  const is2xl = useMediaQuery("2xl");
  const isXl  = useMediaQuery("xl");
  const isLg  = useMediaQuery("lg");
  const isMd  = useMediaQuery("md");
  const isSm  = useMediaQuery("sm");
  const isXs  = useMediaQuery("xs");

  if (is2xl) return "2xl";
  if (isXl)  return "xl";
  if (isLg)  return "lg";
  if (isMd)  return "md";
  if (isSm)  return "sm";
  if (isXs)  return "xs";
  return "xs";
}
