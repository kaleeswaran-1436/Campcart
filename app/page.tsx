import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { ShieldCheck, Zap, QrCode, MessageCircle, BookOpen, FlaskConical, Calculator } from "lucide-react";

export const metadata: Metadata = {
  title: "CampCart — Student Marketplace",
  description: "Buy, sell, and exchange verified campus essentials. Books, lab materials, calculators, and more.",
};

/* ── Static data (will come from API in feature pages) ─────── */
const CATEGORIES = [
  { icon: BookOpen,     label: "Books",         count: "2.4k",  href: "/browse?category=books" },
  { icon: Calculator,   label: "Calculators",   count: "340",   href: "/browse?category=calculators" },
  { icon: FlaskConical, label: "Lab Materials", count: "810",   href: "/browse?category=lab-materials" },
  { icon: QrCode,       label: "QR Exchanges",  count: "Active", href: "/exchanges" },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Students Only",
    desc: "Every user is verified via college ID — safe, trusted transactions.",
  },
  {
    icon: QrCode,
    title: "QR-Based Handoffs",
    desc: "Generate a secure QR code for on-campus exchanges — no cash hassles.",
  },
  {
    icon: Zap,
    title: "Ultra-Fast Listings",
    desc: "List an item in under 60 seconds. Snap, price, post.",
  },
  {
    icon: MessageCircle,
    title: "In-App Chat",
    desc: "Negotiate and coordinate with buyers/sellers without leaving the app.",
  },
];

const SAMPLE_LISTINGS = [
  { id: "1", title: "Engineering Maths Vol. 2", price: 220, originalPrice: 480, condition: "Good", category: "Books" },
  { id: "2", title: "Casio FX-991ES Plus",      price: 850, originalPrice: 1299, condition: "Like New", category: "Calculators" },
  { id: "3", title: "Lab Coat (L / XL)",        price: 150, originalPrice: 299, condition: "New", category: "Lab" },
  { id: "4", title: "Data Structures - Cormen", price: 340, originalPrice: 699, condition: "Good", category: "Books" },
  { id: "5", title: "Oscilloscope Probe Set",   price: 600, originalPrice: 950, condition: "Fair", category: "Lab" },
  { id: "6", title: "Graph Theory Notes (PDF)", price: 50,  originalPrice: 0,   condition: "New", category: "Notes" },
];

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[var(--color-slate)]">
          {/* Subtle pattern overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, var(--color-soft-white) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <Container className="relative">
            <div className="py-16 sm:py-20 md:py-24 max-w-2xl">
              <Badge variant="mint" dot className="mb-4">
                Student-Verified Marketplace
              </Badge>
              <h1 className="text-[var(--color-soft-white)] font-bold leading-tight mb-4 text-3xl sm:text-4xl md:text-5xl">
                Buy. Sell. Exchange.{" "}
                <span className="text-[var(--color-honey)]">Campus-style.</span>
              </h1>
              <p className="text-[var(--color-mint)] text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
                CampCart is the verified marketplace for students — sell your books, calculators, and lab materials in 60 seconds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button href="/browse" variant="primary" size="lg">
                  Browse Listings
                </Button>
                <Button href="/auth/register" variant="outline" size="lg" className="border-[var(--color-mint)] text-[var(--color-mint)] hover:bg-white/10">
                  Get Verified →
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Categories ────────────────────────────────────────── */}
        <section className="py-10 border-b border-[var(--border-subtle)] bg-[var(--surface)]">
          <Container>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map(({ icon: Icon, label, count, href }) => (
                <a
                  key={label}
                  href={href}
                  className="surface flex items-center gap-3 px-4 py-3 hover:border-[var(--color-mint)] group transition-all"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-mint-light)] text-[var(--color-slate)] group-hover:bg-[var(--color-mint)] transition-colors">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
                    <p className="text-xs text-[var(--muted)]">{count} items</p>
                  </span>
                </a>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Sample Listings ───────────────────────────────────── */}
        <section className="py-10">
          <Container>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-[var(--foreground)]">Fresh Listings</h2>
              <Button href="/browse" variant="ghost" size="sm">
                See all →
              </Button>
            </div>

            <div className="grid-marketplace">
              {SAMPLE_LISTINGS.map((item) => (
                <Card key={item.id} interactive>
                  {/* Image placeholder */}
                  <div className="aspect-square bg-[var(--surface-hover)] flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-[var(--border)]" />
                  </div>

                  <CardHeader className="px-3 pt-2.5 pb-1">
                    <Badge
                      variant={
                        item.condition === "New" ? "new" :
                        item.condition === "Like New" ? "mint" :
                        "used"
                      }
                      className="mb-1"
                    >
                      {item.condition}
                    </Badge>
                    <p className="text-xs font-medium text-[var(--foreground)] line-clamp-2 leading-snug">
                      {item.title}
                    </p>
                  </CardHeader>

                  <CardBody className="px-3 pt-1 pb-3">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold text-[var(--color-slate)]">
                        ₹{item.price}
                      </span>
                      {item.originalPrice > 0 && (
                        <span className="text-xs text-[var(--muted)] line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--muted)] mt-0.5">{item.category}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Features ──────────────────────────────────────────── */}
        <section className="py-12 bg-[var(--surface)] border-t border-[var(--border-subtle)]">
          <Container>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-2">
                Built for campus life
              </h2>
              <p className="text-sm text-[var(--muted)] max-w-md mx-auto">
                Every feature is designed around the way students actually buy and sell on campus.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--background)] hover:border-[var(--color-mint)] transition-colors">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-mint-light)] text-[var(--color-slate)] mb-4">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">{title}</h3>
                  <p className="text-xs text-[var(--muted)] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section className="py-14 bg-[var(--color-slate)]">
          <Container className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-soft-white)] mb-3">
              Ready to sell your first item?
            </h2>
            <p className="text-[var(--color-mint)] text-sm mb-7 max-w-md mx-auto">
              Join thousands of verified students already using CampCart to save money on textbooks and supplies.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/auth/register" variant="primary" size="lg">
                Start Selling Free
              </Button>
              <Button
                href="/browse"
                variant="outline"
                size="lg"
                className="border-[var(--color-mint)] text-[var(--color-mint)] hover:bg-white/10"
              >
                Browse First
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
