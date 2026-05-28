import Link from "next/link";
import { Container } from "@/components/layout/Container";
import {
  BookOpen, Calculator, FlaskConical, QrCode,
  Laptop, Shirt, Music, Package
} from "lucide-react";

const CATEGORIES = [
  { icon: BookOpen,     label: "Books",         href: "/browse?category=BOOKS",         color: "from-blue-500/20 to-blue-600/10",   text: "text-blue-600",   ring: "ring-blue-200" },
  { icon: Calculator,   label: "Calculators",   href: "/browse?category=CALCULATORS",   color: "from-purple-500/20 to-purple-600/10", text: "text-purple-600", ring: "ring-purple-200" },
  { icon: FlaskConical, label: "Lab Materials", href: "/browse?category=LAB_MATERIALS", color: "from-emerald-500/20 to-emerald-600/10", text: "text-emerald-600", ring: "ring-emerald-200" },
  { icon: Laptop,       label: "Electronics",   href: "/browse?category=ELECTRONICS",   color: "from-amber-500/20 to-amber-600/10",  text: "text-amber-600",  ring: "ring-amber-200" },
  { icon: Shirt,        label: "Clothing",      href: "/browse?category=CLOTHING",      color: "from-pink-500/20 to-pink-600/10",   text: "text-pink-600",   ring: "ring-pink-200" },
  { icon: Music,        label: "Instruments",   href: "/browse?category=INSTRUMENTS",   color: "from-red-500/20 to-red-600/10",     text: "text-red-600",    ring: "ring-red-200" },
  { icon: QrCode,       label: "QR Exchanges",  href: "/exchanges",                     color: "from-[#D4A64F]/20 to-[#C8943C]/10", text: "text-[#D4A64F]",  ring: "ring-[#D4A64F]/30" },
  { icon: Package,      label: "Other",         href: "/browse",                        color: "from-slate-500/20 to-slate-600/10", text: "text-slate-600",  ring: "ring-slate-200" },
];

export function CategorySection() {
  return (
    <section className="py-10 border-b border-[var(--cc-border-subtle)] bg-[var(--cc-surface)]">
      <Container>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[var(--cc-text-primary)]">Browse by Category</h2>
          <Link href="/browse" className="text-xs font-medium text-[var(--cc-primary)] hover:text-[var(--cc-primary-hover)] transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map(({ icon: Icon, label, href, color, text }) => (
            <Link
              key={label}
              href={href}
              className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-[var(--cc-bg-muted)] transition-all duration-200 hover:-translate-y-1"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className={`h-5 w-5 ${text}`} />
              </span>
              <span className="text-[11px] font-medium text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text-primary)] text-center leading-tight transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
