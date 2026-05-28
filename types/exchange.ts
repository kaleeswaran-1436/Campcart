import type { ExchangeMethod, ExchangeStatus } from "./enums";
import type { ID, Timestamp } from "./listing";

export interface QRExchange {
  id: ID;
  listingId: ID;
  listingTitle: string;
  buyerId: ID;
  sellerId: ID;
  method: ExchangeMethod;
  status: ExchangeStatus;
  qrCode: string;              // base64 data URL or CDN URL
  meetupLocation?: string;
  meetupNotes?: string;
  scheduledAt?: Timestamp;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;
  cancelledAt?: Timestamp;
  cancellationReason?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface QRScanResult {
  exchangeId: ID;
  isValid: boolean;
  listing: { id: ID; title: string; price: number };
  seller: { id: ID; name: string };
  buyer: { id: ID; name: string };
}
