import { MarketplaceNavbar } from "@/components/marketplace/MarketplaceNavbar";
import { BottomNav } from "@/components/marketplace/BottomNav";
import { ConditionalSidebar } from "@/components/marketplace/ConditionalSidebar";

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--cc-bg)] relative">
      <MarketplaceNavbar />
      
      <div className="flex-1 flex container-cc relative items-start gap-6 py-6 w-full max-w-7xl mx-auto">
        <ConditionalSidebar />
        
        <main className="flex-1 min-w-0 pb-20 sm:pb-8">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
