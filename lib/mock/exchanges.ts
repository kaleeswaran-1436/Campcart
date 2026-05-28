/**
 * CampCart — Mock Exchange / Transaction data
 * Used by the Exchanges page and Dashboard activity feed.
 */

import { ExchangeStatus } from "@/types/enums";
import type { QRExchange } from "@/types/exchange";

// ── Mock "current user" ID (consistent across the app) ──────────
export const MOCK_CURRENT_USER_ID = "current-user";

// ── Mock Exchanges ───────────────────────────────────────────────
export const MOCK_EXCHANGES: (QRExchange & {
  listingImageUrl: string;
  listingPrice: number;
  otherParty: { id: string; name: string; isVerified: boolean };
  isBuyer: boolean;
})[] = [
  {
    id: "ex-001",
    listingId: "item-102",
    listingTitle: "Casio FX-991ES Plus Scientific Calculator",
    listingImageUrl:
      "https://images.unsplash.com/photo-1574607383471-2947118ed3b6?q=80&w=300&auto=format&fit=crop",
    listingPrice: 600,
    buyerId: MOCK_CURRENT_USER_ID,
    sellerId: "user-3",
    method: "qr-code",
    status: ExchangeStatus.IN_PROGRESS,
    qrCode: "",
    meetupLocation: "Library Main Entrance",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // 4h from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    otherParty: { id: "user-3", name: "Priya M.", isVerified: true },
    isBuyer: true,
  },
  {
    id: "ex-002",
    listingId: "item-105",
    listingTitle: "Handwritten DSA Notes (C++)",
    listingImageUrl:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=300&auto=format&fit=crop",
    listingPrice: 50,
    buyerId: "user-4",
    sellerId: MOCK_CURRENT_USER_ID,
    method: "qr-code",
    status: ExchangeStatus.CONFIRMED,
    qrCode: "",
    meetupLocation: "Cafeteria Block C",
    scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // tomorrow
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    otherParty: { id: "user-4", name: "Arjun K.", isVerified: true },
    isBuyer: false,
  },
  {
    id: "ex-003",
    listingId: "item-101",
    listingTitle: "Engineering Mathematics Vol. 2 (Grewal)",
    listingImageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop",
    listingPrice: 350,
    buyerId: MOCK_CURRENT_USER_ID,
    sellerId: "user-2",
    method: "qr-code",
    status: ExchangeStatus.COMPLETED,
    qrCode: "",
    meetupLocation: "Engineering Block B",
    confirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    otherParty: { id: "user-2", name: "Rahul S.", isVerified: true },
    isBuyer: true,
  },
  {
    id: "ex-004",
    listingId: "item-106",
    listingTitle: "Mini Drafter for Engineering Drawing",
    listingImageUrl:
      "https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=300&auto=format&fit=crop",
    listingPrice: 200,
    buyerId: "user-5",
    sellerId: MOCK_CURRENT_USER_ID,
    method: "qr-code",
    status: ExchangeStatus.COMPLETED,
    qrCode: "",
    meetupLocation: "Main Gate",
    confirmedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    otherParty: { id: "user-5", name: "Sneha R.", isVerified: false },
    isBuyer: false,
  },
  {
    id: "ex-005",
    listingId: "item-104",
    listingTitle: "Arduino Uno R3 Starter Kit",
    listingImageUrl:
      "https://images.unsplash.com/photo-1608564697071-ddf911d81370?q=80&w=300&auto=format&fit=crop",
    listingPrice: 800,
    buyerId: MOCK_CURRENT_USER_ID,
    sellerId: "user-2",
    method: "qr-code",
    status: ExchangeStatus.CANCELLED,
    qrCode: "",
    cancellationReason: "Seller cancelled — item already sold",
    cancelledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    otherParty: { id: "user-2", name: "Rahul S.", isVerified: true },
    isBuyer: true,
  },
];

// ── Derived helpers ──────────────────────────────────────────────
export const ACTIVE_EXCHANGES = MOCK_EXCHANGES.filter(
  (e) =>
    e.status === ExchangeStatus.IN_PROGRESS ||
    e.status === ExchangeStatus.CONFIRMED ||
    e.status === ExchangeStatus.PENDING
);

export const COMPLETED_EXCHANGES = MOCK_EXCHANGES.filter(
  (e) => e.status === ExchangeStatus.COMPLETED
);
