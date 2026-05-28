import Link from "next/link";
import { GraduationCap, ExternalLink, AtSign } from "lucide-react";
import { Container } from "./Container";

const FOOTER_LINKS = {
  Marketplace: [
    { label: "Browse All", href: "/browse" },
    { label: "Books", href: "/browse?category=books" },
    { label: "Calculators", href: "/browse?category=calculators" },
    { label: "Lab Materials", href: "/browse?category=lab-materials" },
  ],
  Account: [
    { label: "Sign In", href: "/auth/login" },
    { label: "Register", href: "/auth/register" },
    { label: "Sell an Item", href: "/sell" },
    { label: "My Listings", href: "/dashboard/listings" },
  ],
  Support: [
    { label: "Help Center", href: "/help" },
    { label: "Safety Tips", href: "/safety" },
    { label: "Report an Issue", href: "/report" },
    { label: "Contact Us", href: "/contact" },
  ],
} as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--surface)]">
      <Container>
        {/* Main footer content */}
        <div className="py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-slate)] text-[var(--color-honey)]">
                <GraduationCap className="h-3.5 w-3.5" />
              </span>
              <span className="font-semibold text-[var(--color-slate)] tracking-tight">
                Camp<span className="text-[var(--color-honey)]">Cart</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--muted)] leading-relaxed max-w-[200px]">
              The verified student marketplace for books, lab kits, calculators, and more.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <AtSign className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([group, links]) => (
              <div key={group}>
                <h3 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">
                  {group}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
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

        {/* Bottom bar */}
        <div className="py-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--muted)]">
            © {year} CampCart. Built for students, by students.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
