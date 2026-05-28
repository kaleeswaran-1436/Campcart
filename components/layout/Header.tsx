"use client";

import Link from "next/link";
import { Search, Bell, Menu, X, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

const NAV_LINKS = [
  { label: "Browse", href: "/browse" },
  { label: "Books", href: "/browse?category=books" },
  { label: "Calculators", href: "/browse?category=calculators" },
  { label: "Lab Materials", href: "/browse?category=lab-materials" },
];

/**
 * CampCart primary navigation header.
 * Responsive: collapses to hamburger on mobile.
 */
export function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <Container>
        <div className="flex h-14 items-center gap-4">

          {/* ── Logo ──────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-slate)] text-[var(--color-honey)] transition-transform group-hover:scale-105">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-semibold text-[var(--color-slate)] text-lg tracking-tight">
              Camp<span className="text-[var(--color-honey)]">Cart</span>
            </span>
          </Link>

          {/* ── Desktop Nav ───────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-[var(--muted)] rounded-md hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Spacer ────────────────────────────────── */}
          <div className="flex-1" />

          {/* ── Search trigger ───────────────────────── */}
          <button
            aria-label="Open search"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--muted)] bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-lg hover:border-[var(--border)] transition-colors duration-150 min-w-[180px]"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search listings…</span>
          </button>

          {/* ── Actions ───────────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="relative p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors duration-150"
            >
              <Bell className="h-4.5 w-4.5" />
              {/* Unread dot */}
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-honey)]" />
            </button>

            {/* Sell CTA */}
            <Button
              href="/sell"
              variant="primary"
              size="sm"
              className="hidden sm:inline-flex"
            >
              + Sell
            </Button>

            {/* Avatar / Login */}
            <Link
              href="/auth/login"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-mint)] text-[var(--color-slate)] text-xs font-semibold hover:bg-[var(--color-mint-dark)] transition-colors duration-150"
              aria-label="Account"
            >
              CC
            </Link>

            {/* Mobile hamburger */}
            <button
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className="md:hidden p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] rounded-lg transition-colors"
              onClick={() => setIsMobileOpen((v) => !v)}
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* ── Mobile drawer ─────────────────────────────── */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-[var(--border-subtle)]",
          isMobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <Container>
          <div className="py-3 flex flex-col gap-1">
            {/* Mobile search */}
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--muted)] bg-[var(--surface-hover)] rounded-lg mb-2">
              <Search className="h-3.5 w-3.5" />
              <span>Search listings…</span>
            </button>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-[var(--muted)] rounded-md hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)] transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-[var(--border-subtle)] mt-1">
              <Button href="/sell" variant="primary" size="sm" className="w-full justify-center">
                + List Item
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
}
