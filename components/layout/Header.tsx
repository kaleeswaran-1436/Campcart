"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Bell, Menu, X, GraduationCap, Sun, Moon, ChevronDown,
  LayoutDashboard, Package, Settings, LogOut, User, ShieldCheck,
  Tag, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "./Container";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "@/components/providers/ThemeProvider";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "Browse",        href: "/browse" },
  { label: "Books",         href: "/browse?category=BOOKS" },
  { label: "Calculators",   href: "/browse?category=CALCULATORS" },
  { label: "Lab Materials", href: "/browse?category=LAB_MATERIALS" },
];

export function Header() {
  const router = useRouter();
  const { isAuthenticated, user, clearSession } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [isMobileOpen, setIsMobileOpen]   = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery]     = useState("");
  const [scrolled, setScrolled]           = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef   = useRef<HTMLInputElement>(null);

  // Scroll detection for navbar elevation
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearSession();
    setIsDropdownOpen(false);
    router.push("/");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isDark = resolvedTheme === "dark";

  // User initials fallback
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CC";

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "glass-nav shadow-sm"
            : "bg-[var(--cc-surface)]/90 backdrop-blur-md border-b border-[var(--cc-border-subtle)]"
        )}
      >
        <Container>
          <div className="flex h-16 items-center gap-4">

            {/* ── Logo ──────────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <motion.span
                whileHover={{ scale: 1.08, rotate: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1B1F23] to-[#2E3436] text-[#D4A64F] shadow-sm"
              >
                <GraduationCap className="h-4.5 w-4.5" />
              </motion.span>
              <span className="font-bold text-[var(--cc-text-primary)] text-lg tracking-tight">
                Camp<span className="text-[#D4A64F]">Cart</span>
              </span>
            </Link>

            {/* ── Desktop Nav ────────────────────────────────── */}
            <nav className="hidden md:flex items-center gap-0.5 ml-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3.5 py-2 text-sm font-medium text-[var(--cc-text-secondary)] rounded-lg hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)] transition-all duration-150 group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#D4A64F] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              ))}
            </nav>

            {/* ── Spacer ─────────────────────────────────────── */}
            <div className="flex-1" />

            {/* ── Search Bar (Desktop) ───────────────────────── */}
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.form
                  key="search-open"
                  initial={{ width: 180, opacity: 0.7 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 180, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSearch}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] dark:bg-black/[0.15] backdrop-blur-md border border-[#D4A64F]/50 rounded-xl shadow-[0_0_20px_rgba(212,166,79,0.2)] ring-2 ring-[#D4A64F]/30"
                >
                  <Search className="h-3.5 w-3.5 text-[#D4A64F] shrink-0 animate-pulse-soft" />
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search listings…"
                    className="flex-1 bg-transparent text-sm text-[var(--cc-text-primary)] placeholder:text-[var(--cc-text-disabled)] outline-none"
                    autoFocus
                  />
                  <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}>
                    <X className="h-3.5 w-3.5 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)]" />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  key="search-closed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => setIsSearchOpen(true)}
                  aria-label="Open search"
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-[var(--cc-text-secondary)] bg-white/[0.04] dark:bg-white/[0.02] border border-[var(--cc-border-subtle)] rounded-xl hover:border-[#D4A64F]/40 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(212,166,79,0.1)] transition-all duration-300 min-w-[170px] group"
                >
                  <Search className="h-3.5 w-3.5 group-hover:text-[#D4A64F] transition-colors" />
                  <span className="flex-1 text-left">Search listings…</span>
                  <kbd className="hidden lg:inline-flex px-1.5 py-0.5 rounded bg-[var(--cc-border-subtle)] text-[10px] font-mono text-[var(--cc-text-disabled)] group-hover:text-[var(--cc-text-secondary)] transition-colors">⌘K</kbd>
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Actions ──────────────────────────────────────── */}
            <div className="flex items-center gap-1.5">

              {/* Dark mode toggle */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="p-2.5 rounded-xl text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)] transition-all duration-150"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Sun className="h-4 w-4" />
                    </motion.span>
                  ) : (
                    <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Moon className="h-4 w-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Notifications"
                className="relative p-2.5 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)] rounded-xl transition-all duration-150"
              >
                <Bell className="h-4 w-4" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#D4A64F] ring-2 ring-[var(--cc-surface)]"
                />
              </motion.button>

              {/* Sell CTA */}
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="hidden sm:block">
                <Link
                  href={isAuthenticated ? "/sell" : "/login?next=/sell"}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4A64F] to-[#C8943C] text-white text-sm font-semibold shadow-sm hover:shadow-md hover:from-[#E5B95C] hover:to-[#D4A64F] transition-all duration-200"
                >
                  <Tag className="h-3.5 w-3.5" />
                  Sell
                </Link>
              </motion.div>

              {/* Profile / Auth */}
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsDropdownOpen((v) => !v)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-[var(--cc-bg-muted)] transition-all duration-150 group"
                    aria-label="Account menu"
                  >
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#D4A64F] to-[#C8943C] flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-[var(--cc-text-secondary)] transition-transform duration-200",
                        isDropdownOpen && "rotate-180"
                      )}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-56 glass-card rounded-2xl border border-[var(--cc-border-subtle)] shadow-xl overflow-hidden"
                      >
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-[var(--cc-border-subtle)]">
                          <p className="text-sm font-semibold text-[var(--cc-text-primary)] truncate">{user.name}</p>
                          <p className="text-xs text-[var(--cc-text-secondary)] truncate">{user.email}</p>
                          {user.verification === "verified" && (
                            <div className="flex items-center gap-1 mt-1">
                              <ShieldCheck className="h-3 w-3 text-emerald-500" />
                              <span className="text-[10px] text-emerald-600 font-medium">Verified Student</span>
                            </div>
                          )}
                        </div>

                        {/* Menu links */}
                        <div className="py-1.5">
                          {[
                            { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard" },
                            { icon: Package,         label: "My Listings",  href: "/dashboard/listings" },
                            { icon: User,            label: "My Profile",   href: `/profile/${user.id}` },
                            { icon: MessageSquare,   label: "Messages",     href: "/chats" },
                            { icon: Settings,        label: "Settings",     href: "/dashboard/settings" },
                          ].map(({ icon: Icon, label, href }) => (
                            <Link
                              key={href}
                              href={href}
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)] transition-colors"
                            >
                              <Icon className="h-4 w-4" />
                              {label}
                            </Link>
                          ))}
                        </div>

                        <div className="border-t border-[var(--cc-border-subtle)] py-1.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="hidden sm:inline-flex px-3.5 py-2 text-sm font-medium text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)] rounded-xl transition-all duration-150"
                  >
                    Sign In
                  </Link>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/register"
                      className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1B1F23] to-[#2E3436] rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile hamburger */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                className="md:hidden p-2.5 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] hover:bg-[var(--cc-bg-muted)] rounded-xl transition-colors"
                onClick={() => setIsMobileOpen((v) => !v)}
              >
                <AnimatePresence mode="wait">
                  {isMobileOpen ? (
                    <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </Container>

        {/* ── Mobile Drawer ───────────────────────────────────── */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-[var(--cc-border-subtle)]"
            >
              <Container>
                <div className="py-4 flex flex-col gap-1">
                  {/* Mobile search */}
                  <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-2.5 bg-[var(--cc-bg-muted)] rounded-xl mb-2">
                    <Search className="h-4 w-4 text-[var(--cc-text-secondary)]" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search listings…"
                      className="flex-1 bg-transparent text-sm text-[var(--cc-text-primary)] placeholder:text-[var(--cc-text-disabled)] outline-none"
                    />
                  </form>

                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ x: -16, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-[var(--cc-text-secondary)] rounded-xl hover:bg-[var(--cc-bg-muted)] hover:text-[var(--cc-text-primary)] transition-colors"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}

                  <div className="pt-3 mt-1 border-t border-[var(--cc-border-subtle)] flex flex-col gap-2">
                    <Link
                      href={isAuthenticated ? "/sell" : "/login?next=/sell"}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64F] to-[#C8943C] text-white text-sm font-semibold"
                    >
                      <Tag className="h-4 w-4" />
                      List an Item
                    </Link>
                    {!isAuthenticated && (
                      <Link
                        href="/login"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center justify-center py-2.5 rounded-xl border border-[var(--cc-border)] text-[var(--cc-text-secondary)] text-sm font-medium hover:bg-[var(--cc-bg-muted)] transition-colors"
                      >
                        Sign In
                      </Link>
                    )}
                    {isAuthenticated && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--cc-border)] text-[var(--cc-text-secondary)] text-sm font-medium hover:bg-[var(--cc-bg-muted)] transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    {/* Dark mode toggle mobile */}
                    <button
                      onClick={toggleTheme}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--cc-border)] text-[var(--cc-text-secondary)] text-sm font-medium hover:bg-[var(--cc-bg-muted)] transition-colors"
                    >
                      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                      {isDark ? "Light Mode" : "Dark Mode"}
                    </button>
                  </div>
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
