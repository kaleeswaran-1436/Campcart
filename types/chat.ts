import type { MessageStatus, ListingStatus } from "./enums";
import type { ID, Timestamp } from "./listing";

export type ConversationStage =
  | "NEGOTIATING"
  | "RESERVED"
  | "MEETUP_PLANNED"
  | "COMPLETED"
  | "CANCELLED";

export type MessageType =
  | "TEXT"
  | "SYSTEM"
  | "MEETUP"
  | "RESERVATION";

export interface MeetupLocation {
  id: string;
  title: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  meetupTime?: string;
  confirmedByBuyer?: boolean;
  confirmedBySeller?: boolean;
}

export interface ChatMessage {
  id: ID;
  conversationId: ID;
  senderId: ID;
  type: MessageType;
  content: string;
  attachmentUrl?: string;
  meetup?: MeetupLocation;
  status: MessageStatus;
  createdAt: Timestamp;
}

export interface ConversationParticipant {
  id: ID;
  name: string;
  avatar?: string;
  isVerified: boolean;
}

export interface Conversation {
  id: ID;
  listingId: ID;
  listingTitle: string;
  listingImageUrl?: string;
  listingPrice: number;
  listingStatus: ListingStatus;
  stage: ConversationStage;
  participants: ConversationParticipant[];
  lastMessage?: Pick<ChatMessage, "content" | "createdAt" | "senderId" | "type">;
  unreadCount: number;
  isArchived: boolean;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}
