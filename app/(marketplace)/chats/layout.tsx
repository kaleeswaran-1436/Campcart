import { ConditionalSidebar } from "@/components/marketplace/ConditionalSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chats | CampCart Marketplace",
  description: "Your conversations on CampCart",
};

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] w-full bg-[var(--cc-bg)] overflow-hidden">
      {/* On desktop, we still show the ConditionalSidebar for marketplace navigation */}
      <ConditionalSidebar />
      <div className="flex-1 flex flex-col h-[100dvh] min-w-0">
        {children}
      </div>
    </div>
  );
}
