import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/marketplace/BottomNav";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--cc-bg)]">
      <Header />
      <main className="flex-1 container-cc py-6 pb-24 sm:pb-8">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
