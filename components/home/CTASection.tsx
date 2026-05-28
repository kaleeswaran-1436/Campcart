import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden hero-dark">
      {/* Background effects */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(212,166,79,0.15) 0%, transparent 60%), " +
            "radial-gradient(ellipse at 80% 30%, rgba(184,204,193,0.08) 0%, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <Container className="relative text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D4A64F]/30 bg-[#D4A64F]/10 text-[#D4A64F] text-xs font-semibold mb-6">
            <Sparkles className="h-3 w-3" />
            Join 12,000+ students
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            Ready to sell your
            <span className="gradient-text"> first item?</span>
          </h2>

          <p className="text-[#9BA3AD] text-lg mb-10 leading-relaxed">
            Join thousands of verified students already using CampCart to save money on textbooks
            and supplies. Free to join, forever.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#D4A64F] to-[#C8943C] text-white font-bold text-sm hover:from-[#E5B95C] hover:to-[#D4A64F] hover:shadow-xl hover:shadow-[#D4A64F]/25 hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Selling Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-white/20 text-white/90 font-bold text-sm hover:bg-white/10 hover:border-white/30 transition-all duration-200"
            >
              Browse First
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
