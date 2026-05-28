import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap, ShieldCheck, QrCode, MessageCircle,
  BookOpen, Calculator, FlaskConical, ArrowRight,
  TrendingUp, Users
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { APP_ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "CampCart — The Verified Student Marketplace",
  description: "Buy and sell books, calculators, lab materials and more with verified students on your campus. QR-based secure exchanges.",
};

/* ── Static preview data ──────────────────────────────────── */
const PREVIEW_LISTINGS = [
  { title: "Engineering Mathematics Vol. 2", price: 180, original: 450, condition: "Good", category: "Books", color: "bg-blue-50" },
  { title: "Casio FX-991ES Scientific Calc", price: 650, original: 1200, condition: "Like New", category: "Calculator", color: "bg-purple-50" },
  { title: "Lab Coat — L Size", price: 120, original: 280, condition: "Good", category: "Lab", color: "bg-green-50" },
  { title: "Data Structures Notes Bundle", price: 80, original: null, condition: "New", category: "Notes", color: "bg-orange-50" },
];

const STATS = [
  { icon: Users,     value: "2,400+", label: "Verified Students" },
  { icon: TrendingUp, value: "8,100+", label: "Items Exchanged" },
  { icon: ShieldCheck, value: "100%",  label: "ID Verified" },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Students Only",
    desc: "Every seller is ID-verified. No fake profiles — just real campus peers.",
    color: "text-[var(--cc-success)] bg-[var(--cc-success-subtle)]",
  },
  {
    icon: QrCode,
    title: "QR-Based Exchange",
    desc: "Scan and confirm exchanges in seconds. No cash disputes, no middlemen.",
    color: "text-[var(--cc-primary)] bg-[var(--cc-primary-subtle)]",
  },
  {
    icon: MessageCircle,
    title: "Secure Messaging",
    desc: "Chat directly with buyers or sellers within the app, safely.",
    color: "text-[var(--cc-info)] bg-[var(--cc-info-subtle)]",
  },
];

export default function EntryPage() {
  return (
    <div className="min-h-screen bg-[var(--cc-bg)] flex flex-col">
      {/* ── Top bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[var(--cc-border-subtle)] bg-[var(--cc-surface)]/95 backdrop-blur-sm">
        <div className="container-cc flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--cc-bg-inverse)] text-[var(--cc-primary)]">
              <GraduationCap className="h-3.5 w-3.5" />
            </span>
            <span className="font-bold text-[var(--cc-text-primary)] tracking-tight">
              Camp<span className="text-[var(--cc-primary)]">Cart</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button href={APP_ROUTES.login} variant="ghost" size="sm">Sign In</Button>
            <Button href={APP_ROUTES.register} variant="primary" size="sm">Get Started</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[var(--cc-bg-inverse)] text-white">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px"
            }} />
          </div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--cc-primary)] opacity-10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--cc-secondary)] opacity-10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

          <div className="relative container-cc py-16 sm:py-24 lg:py-28">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-5">
                <Badge variant="verified" className="text-xs">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  ID-Verified Platform
                </Badge>
                <Badge variant="new" className="text-xs">Now Live</Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-5">
                Buy & Sell with
                <br />
                <span className="text-[var(--cc-primary)]">Campus Trust</span>
              </h1>

              <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                CampCart is the verified student marketplace — trade books, calculators, lab materials and more with your real campus peers using QR-secured exchanges.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button href={APP_ROUTES.register} variant="primary" size="lg" className="gap-2 font-semibold">
                  Start Selling Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button href={APP_ROUTES.browse} variant="outline" size="lg"
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                  Browse Listings
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
                {STATS.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-[var(--cc-primary)]" aria-hidden />
                    <div>
                      <div className="text-lg font-bold text-white leading-none">{value}</div>
                      <div className="text-xs text-white/50 mt-0.5">{label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Category Pills ────────────────────────────────── */}
        <section className="border-b border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] py-4">
          <div className="container-cc">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { icon: BookOpen,      label: "Books",       href: APP_ROUTES.category("books") },
                { icon: Calculator,    label: "Calculators", href: APP_ROUTES.category("calculators") },
                { icon: FlaskConical,  label: "Lab",         href: APP_ROUTES.category("lab-materials") },
              ].map(({ icon: Icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--cc-border)] text-sm font-medium text-[var(--cc-text-secondary)] whitespace-nowrap hover:border-[var(--cc-primary)] hover:text-[var(--cc-primary)] hover:bg-[var(--cc-primary-subtle)] transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden />
                  {label}
                </Link>
              ))}
              <Link href={APP_ROUTES.browse}
                className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium text-[var(--cc-primary)] whitespace-nowrap hover:underline">
                All Categories <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Preview Listings ──────────────────────────────── */}
        <section className="py-10 sm:py-16">
          <div className="container-cc">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--cc-text-primary)]">
                  What's on Campus
                </h2>
                <p className="text-sm text-[var(--cc-text-secondary)] mt-1">
                  Real listings from verified students
                </p>
              </div>
              <Link href={APP_ROUTES.browse}
                className="text-sm font-medium text-[var(--cc-primary)] hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {PREVIEW_LISTINGS.map((item) => (
                <div key={item.title}
                  className="group surface overflow-hidden cursor-pointer"
                  aria-label={`${item.title} — ₹${item.price}`}>
                  {/* Image placeholder */}
                  <div className={`${item.color} aspect-square flex items-center justify-center`}>
                    <BookOpen className="h-10 w-10 text-gray-400 group-hover:scale-110 transition-transform" aria-hidden />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="text-[10px] font-semibold text-[var(--cc-text-secondary)] bg-[var(--cc-bg-muted)] px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-[var(--cc-text-disabled)]">{item.condition}</span>
                    </div>
                    <p className="text-xs font-medium text-[var(--cc-text-primary)] line-clamp-2 leading-snug mb-2">
                      {item.title}
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-[var(--cc-primary)]">₹{item.price}</span>
                      {item.original && (
                        <span className="text-xs text-[var(--cc-text-disabled)] line-through">₹{item.original}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA banner */}
            <div className="mt-8 rounded-2xl bg-[var(--cc-bg-inverse)] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-semibold text-lg">Unlock the full marketplace</p>
                <p className="text-white/60 text-sm mt-1">Verify your student ID to buy, sell, and exchange.</p>
              </div>
              <Button href={APP_ROUTES.register} variant="primary" size="md" className="whitespace-nowrap gap-2">
                Get Verified Free
                <ShieldCheck className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────── */}
        <section className="py-10 sm:py-16 bg-[var(--cc-surface)] border-y border-[var(--cc-border-subtle)]">
          <div className="container-cc">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--cc-text-primary)]">
                Built for campus life
              </h2>
              <p className="text-[var(--cc-text-secondary)] text-sm mt-2">
                Everything you need, nothing you don't
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="flex flex-col gap-3 p-5 rounded-2xl border border-[var(--cc-border-subtle)] hover:border-[var(--cc-border)] transition-colors">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[var(--cc-text-primary)] mb-1">{title}</h3>
                    <p className="text-sm text-[var(--cc-text-secondary)] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────── */}
        <section className="py-14 sm:py-20">
          <div className="container-cc text-center">
            <div className="flex justify-center mb-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--cc-primary)] text-white shadow-[var(--cc-shadow-lg)]">
                <GraduationCap className="h-7 w-7" />
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[var(--cc-text-primary)] tracking-tight mb-3">
              Ready to join?
            </h2>
            <p className="text-[var(--cc-text-secondary)] mb-8 max-w-sm mx-auto">
              Sign up in 2 minutes. Verify your student ID. Start buying and selling.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button href={APP_ROUTES.register} variant="primary" size="lg" className="gap-2">
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href={APP_ROUTES.login} variant="outline" size="lg">
                Already have an account?
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-[var(--cc-border-subtle)] py-6 bg-[var(--cc-surface)]">
        <div className="container-cc flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--cc-text-secondary)]">
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-[var(--cc-primary)]" aria-hidden />
            <span className="font-semibold text-[var(--cc-text-primary)]">CampCart</span>
            <span>· For verified students only</span>
          </div>
          <div className="flex gap-4">
            <Link href={APP_ROUTES.privacy} className="hover:text-[var(--cc-text-primary)] transition-colors">Privacy</Link>
            <Link href={APP_ROUTES.terms}   className="hover:text-[var(--cc-text-primary)] transition-colors">Terms</Link>
            <Link href={APP_ROUTES.safety}  className="hover:text-[var(--cc-text-primary)] transition-colors">Safety</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
