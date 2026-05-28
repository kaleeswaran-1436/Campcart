import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { HeroSection } from "@/components/home/HeroSection";
import { CategorySection } from "@/components/home/CategorySection";
import { ListingsSection } from "@/components/home/ListingsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { ListingCardSkeleton } from "@/components/skeletons/ListingCardSkeleton";

export const revalidate = 60; // ISR: revalidate every 60s

export const metadata: Metadata = {
  title: "CampCart — Student Marketplace",
  description:
    "Buy, sell, and exchange verified campus essentials. Books, lab materials, calculators, and more.",
  openGraph: {
    title: "CampCart — Student Marketplace",
    description:
      "Verified student marketplace for books, lab materials, calculators and QR-based exchanges.",
  },
};

async function getHeroData() {
  try {
    const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
        where: { status: "ACTIVE", deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          slug: true,
          title: true,
          price: true,
          originalPrice: true,
          category: true,
          condition: true,
          status: true,
          imageUrl: true,
          imageUrls: true,
          createdAt: true,
          seller: {
            select: {
              id: true,
              name: true,
              avatar: true,
              isVerified: true,
            },
          },
        },
      }),
      prisma.listing.count({ where: { status: "ACTIVE", deletedAt: null } }),
    ]);
    return { listings, totalCount };
  } catch {
    return { listings: [], totalCount: 0 };
  }
}

export default async function HomePage() {
  const { listings, totalCount } = await getHeroData();

  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection listings={listings} totalCount={totalCount} />
        <CategorySection />
        <Suspense
          fallback={
            <div className="py-12">
              <Container>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <ListingCardSkeleton key={i} />
                  ))}
                </div>
              </Container>
            </div>
          }
        >
          <ListingsSection listings={listings} />
        </Suspense>
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
