"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Zap, TrendingUp, Package, CheckCircle2, Star } from "lucide-react";
import { Container } from "@/components/layout/Container";

interface HeroListing {
  id: string;
  slug: string | null;
  title: string;
  price: number;
  originalPrice: number | null;
  category: string;
  condition: string;
  imageUrl: string | null;
  imageUrls: string[];
}

interface HeroSectionProps {
  listings: HeroListing[];
  totalCount: number;
}

const CARDS_DATA = [
  {
    title: "Textbooks & Guides",
    subtitle: "Great prices, great grades.",
    labels: ["Calculus", "Physics", "Chemistry"],
    image: "/images/textbooks_showcase.png",
    price: "₹450",
    badge: "Saves 60%",
    className: "animate-float-card-1",
    left: "10px",
    top: "30px",
    zIndex: 12,
  },
  {
    title: "Scientific Calculator",
    subtitle: "Tested. Trusted. Affordable.",
    labels: ["FX-991ES", "Like New"],
    image: "/images/calculator_showcase.png",
    price: "₹699",
    badge: "Verified",
    className: "animate-float-card-2",
    left: "130px",
    top: "130px",
    zIndex: 15,
  },
  {
    title: "Lab Materials",
    subtitle: "Everything you need.",
    labels: ["Beakers", "Lab Apron"],
    image: "/images/lab_showcase.png",
    price: "₹350",
    badge: "Complete Kit",
    className: "animate-float-card-3",
    left: "250px",
    top: "230px",
    zIndex: 10,
  },
];

const STATS_DATA = [
  { label: "Active Listings", value: "12.8K+", icon: Package, color: "text-[#D4A64F]", delay: 0.1 },
  { label: "Verified Students", value: "8.4K+", icon: ShieldCheck, color: "text-[#D4A64F]", delay: 0.2 },
  { label: "Successful Deals", value: "24.6K+", icon: CheckCircle2, color: "text-[#D4A64F]", delay: 0.3 },
  { label: "Positive Reviews", value: "98%", icon: Star, color: "text-[#D4A64F]", delay: 0.4 },
];

export function HeroSection({ listings: _listings, totalCount: _totalCount }: HeroSectionProps) {
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    },
  };

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex flex-col justify-between bg-[#0B0D10] text-white">
      {/* ── Cinematic Background Image ────────────────── */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src="/images/campus_hero_bg.png"
          alt="Cinematic college campus background"
          className="w-full h-full object-cover opacity-35 scale-[1.02]"
        />
        {/* Layered mask gradients for extreme cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D10] via-[#0B0D10]/80 to-[#0B0D10]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] via-transparent to-[#0B0D10]/60" />
        <div 
          className="absolute inset-0 opacity-70"
          style={{
            background: "radial-gradient(circle at 75% 40%, rgba(212, 166, 79, 0.05) 0%, transparent 60%)",
          }}
        />
      </div>

      <Container className="relative z-10 flex-1 flex flex-col justify-center py-16 md:py-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* ── Left Column: Copy & Actions ──────────────── */}
          <motion.div
            className="lg:col-span-7 flex flex-col text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Premium Badge */}
            <motion.div variants={itemVariants} className="inline-flex justify-center lg:justify-start mb-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D4A64F]/30 bg-[#D4A64F]/10 text-[#D4A64F] text-xs font-semibold tracking-wider">
                <ShieldCheck className="h-3.5 w-3.5" />
                VERIFIED CAMPUS MARKETPLACE
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-6"
            >
              Buy, Sell &amp;
              <br />
              Exchange
              <br />
              <span className="bg-gradient-to-r from-[#F4D086] via-[#D4A64F] to-[#A97C29] bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(212,166,79,0.1)]">
                Safely On Campus.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-[#9BA3AD] text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              The premium peer-to-peer college exchange. Save money on books, lab gear, 
              and calculators. Conduct quick, safe handoffs right on campus with built-in QR verification.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <Link
                href="/browse"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4A64F] to-[#C8943C] text-white font-bold text-sm hover:shadow-[0_0_30px_rgba(212,166,79,0.35)] shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                Browse Listings
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white/90 font-semibold text-sm hover:border-white/30 hover:bg-white/10 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              >
                Get Verified Free
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Right Column: Showcase Deck ─────────────── */}
          <div className="lg:col-span-5 flex items-center justify-center relative h-[420px] sm:h-[480px] w-full max-w-lg mx-auto">
            
            {/* Ambient gold glow */}
            <div className="absolute w-[350px] h-[350px] bg-[#D4A64F]/8 rounded-full blur-[100px] pointer-events-none z-0" />

            {/* Orbit paths */}
            <div className="absolute w-[450px] h-[450px] rounded-full border border-dashed border-[#D4A64F]/8 animate-orbit pointer-events-none" />
            <div className="absolute w-[350px] h-[350px] rounded-full border border-dashed border-white/5 animate-orbit-rev pointer-events-none" />

            {/* Interactive Cards */}
            {CARDS_DATA.map((card, i) => (
              <div
                key={i}
                className={`absolute z-10 duration-500 hover:z-20 ${card.className}`}
                style={{
                  width: 230,
                  left: card.left,
                  top: card.top,
                  zIndex: card.zIndex,
                }}
              >
                <div className="glass-card hover:border-[#D4A64F]/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-105 glow-card-gold cursor-pointer group/item">
                  
                  {/* Card Image */}
                  <div className="relative h-28 bg-[#161920] overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover/item:scale-108"
                    />
                    <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[#D4A64F] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4A64F]/30">
                      {card.badge}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 bg-[#11141B]/80 backdrop-blur-md">
                    <h3 className="text-xs font-bold text-white group-hover/item:text-[#D4A64F] transition-colors">{card.title}</h3>
                    <p className="text-[10px] text-white/50 mb-2 mt-0.5">{card.subtitle}</p>
                    
                    {/* Tags & Price */}
                    <div className="flex flex-wrap items-center justify-between gap-1 mt-2 pt-2 border-t border-white/5">
                      <div className="flex gap-1 flex-wrap">
                        {card.labels.map((lbl, idx) => (
                          <span key={idx} className="text-[9px] bg-white/5 text-white/70 px-1.5 py-0.5 rounded">
                            {lbl}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-extrabold text-[#D4A64F]">{card.price}</span>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </Container>

      {/* ── Bottom: Stats Bar ────────────────────────── */}
      <div className="relative z-10 border-t border-white/5 bg-[#0B0D10]/90 backdrop-blur-md py-6">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/5">
            {STATS_DATA.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay, duration: 0.5 }}
                  className="flex items-center gap-3.5 px-4 md:px-6 pt-4 md:pt-0 hover:bg-white/[0.02] rounded-xl transition-all duration-300 group/stat cursor-pointer py-2"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 group-hover/stat:border-[#D4A64F]/50 group-hover/stat:bg-[#D4A64F]/10 transition-all duration-300">
                    <Icon className={`h-5 w-5 ${stat.color} group-hover/stat:scale-110 transition-transform`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white leading-none group-hover/stat:text-[#D4A64F] transition-colors">
                      {stat.value}
                    </h4>
                    <p className="text-xs text-[#9BA3AD] mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </div>
    </section>
  );
}
