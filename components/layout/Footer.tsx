"use client";

import Link from "next/link";
import { GraduationCap, Mail } from "lucide-react";
import { Container } from "./Container";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FOOTER_LINKS = {
  Marketplace: [
    { label: "Browse All",     href: "/browse" },
    { label: "Books",          href: "/browse?category=BOOKS" },
    { label: "Calculators",    href: "/browse?category=CALCULATORS" },
    { label: "Lab Materials",  href: "/browse?category=LAB_MATERIALS" },
    { label: "Electronics",    href: "/browse?category=ELECTRONICS" },
  ],
  Account: [
    { label: "Sign In",        href: "/login" },
    { label: "Register",       href: "/register" },
    { label: "Sell an Item",   href: "/sell" },
    { label: "My Listings",    href: "/dashboard/listings" },
    { label: "Dashboard",      href: "/dashboard" },
  ],
  Support: [
    { label: "Help Center",    href: "/help" },
    { label: "Safety Tips",    href: "/safety" },
    { label: "Report an Issue",href: "/report" },
    { label: "Contact Us",     href: "/contact" },
  ],
} as const;

const SOCIAL = [
  { icon: GithubIcon,    href: "https://github.com",    label: "GitHub" },
  { icon: TwitterIcon,   href: "https://twitter.com",   label: "Twitter" },
  { icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { icon: Mail,          href: "mailto:hello@campcart.in", label: "Email" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto relative overflow-hidden" style={{ background: "linear-gradient(180deg, var(--cc-surface) 0%, #1B1F23 100%)" }}>
      {/* Gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--cc-border)] to-transparent" />

      {/* Newsletter strip */}
      <div className="bg-gradient-to-r from-[#1B1F23] via-[#2A3038] to-[#1B1F23] py-10 border-b border-white/5">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Stay in the loop</h3>
              <p className="text-sm text-[#8D949C]">Get notified when new items drop on campus.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@college.edu"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-[#5E6773] text-sm outline-none focus:border-[#D4A64F] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4A64F] to-[#C8943C] text-white text-sm font-semibold hover:from-[#E5B95C] hover:to-[#D4A64F] transition-all duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </div>

      {/* Main footer */}
      <div className="bg-[#1B1F23] py-12">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4A64F] to-[#C8943C]">
                  <GraduationCap className="h-4.5 w-4.5 text-white" />
                </span>
                <span className="font-bold text-white text-lg tracking-tight">
                  Camp<span className="text-[#D4A64F]">Cart</span>
                </span>
              </Link>
              <p className="text-sm text-[#8D949C] leading-relaxed max-w-xs mb-5">
                The verified student marketplace for books, lab kits, calculators, and more.
                Safe. Fast. Campus-native.
              </p>
              <div className="flex gap-3">
                {SOCIAL.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#8D949C] hover:bg-[#D4A64F]/20 hover:text-[#D4A64F] transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
              ([group, links]) => (
                <div key={group}>
                  <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">
                    {group}
                  </h3>
                  <ul className="space-y-2.5">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-[#8D949C] hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#0F1215] py-4">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-[#5E6773]">
              © {year} CampCart. Built for students, by students.
            </p>
            <div className="flex gap-5">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-xs text-[#5E6773] hover:text-[#8D949C] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
