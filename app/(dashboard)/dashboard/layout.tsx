import type { Metadata } from "next";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { MobileDashboardNav } from "@/components/dashboard/MobileDashboardNav";

export const metadata: Metadata = {
  title: { default: "Dashboard | CampCart", template: "%s | CampCart" },
  description: "Manage your listings, trades, and profile on CampCart.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--cc-bg)]">
      {/* Desktop sidebar */}
      <DashboardSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <MobileDashboardNav />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-5xl mx-auto pb-24 md:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
