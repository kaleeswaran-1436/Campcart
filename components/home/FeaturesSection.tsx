import { Container } from "@/components/layout/Container";
import { ShieldCheck, QrCode, Zap, MessageCircle, Star, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Students Only",
    desc: "Every user is verified via college ID — safe, trusted campus transactions only.",
    color: "from-emerald-500/20 to-emerald-600/10",
    text: "text-emerald-600",
  },
  {
    icon: QrCode,
    title: "QR-Based Handoffs",
    desc: "Generate a secure QR code for on-campus exchanges — no cash hassles.",
    color: "from-[#D4A64F]/20 to-[#C8943C]/10",
    text: "text-[#D4A64F]",
  },
  {
    icon: Zap,
    title: "60-Second Listings",
    desc: "Snap, price, and post your item in under 60 seconds. Ultra-fast flow.",
    color: "from-blue-500/20 to-blue-600/10",
    text: "text-blue-600",
  },
  {
    icon: MessageCircle,
    title: "In-App Chat",
    desc: "Negotiate and coordinate with buyers directly — no external apps needed.",
    color: "from-purple-500/20 to-purple-600/10",
    text: "text-purple-600",
  },
  {
    icon: Star,
    title: "Seller Ratings",
    desc: "Rate your experience after every transaction. Build trust on campus.",
    color: "from-amber-500/20 to-amber-600/10",
    text: "text-amber-600",
  },
  {
    icon: Lock,
    title: "Secure Exchanges",
    desc: "QR token-secured handoffs ensure both parties confirm before any transfer.",
    color: "from-red-500/20 to-red-600/10",
    text: "text-red-600",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-[var(--cc-surface)] border-t border-[var(--cc-border-subtle)]">
      <Container>
        <div className="text-center mb-12">
          <span className="inline-flex px-3 py-1 rounded-full bg-[var(--cc-primary-subtle)] text-[var(--cc-primary)] text-xs font-semibold mb-3">
            Built for campus life
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-[var(--cc-text-primary)] mb-3 tracking-tight">
            Everything you need to
            <span className="gradient-text"> trade smarter.</span>
          </h2>
          <p className="text-[var(--cc-text-secondary)] max-w-lg mx-auto leading-relaxed">
            Every feature is designed around the way students actually buy and sell on campus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color, text }, i) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-[var(--cc-border-subtle)] bg-[var(--cc-bg)] hover:border-[var(--cc-border)] hover:shadow-md hover:-translate-y-1 transition-all duration-200 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${color} mb-5 group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className={`h-6 w-6 ${text}`} />
              </span>
              <h3 className="text-base font-bold text-[var(--cc-text-primary)] mb-2">{title}</h3>
              <p className="text-sm text-[var(--cc-text-secondary)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
