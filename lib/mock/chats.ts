import { ListingStatus, MessageStatus } from "@/types/enums";
import type { Conversation, ChatMessage } from "@/types/chat";


const CURRENT_USER_ID = "current-user";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    listingId: "item-101",
    listingTitle: "Engineering Mathematics 14th Ed",
    listingImageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
    listingPrice: 450,
    listingStatus: ListingStatus.ACTIVE,
    stage: "NEGOTIATING",
    participants: [
      { id: CURRENT_USER_ID, name: "You", isVerified: true },
      { id: "user-2", name: "Rahul S.", avatar: "https://i.pravatar.cc/150?u=user2", isVerified: true },
    ],
    lastMessage: {
      content: "Would you take 400 for it?",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      senderId: "user-2",
      type: "TEXT"
    },
    unreadCount: 1,
    isArchived: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "conv-2",
    listingId: "item-102",
    listingTitle: "Casio fx-991EX Scientific Calculator",
    listingImageUrl: "https://images.unsplash.com/photo-1574607407408-1e681c46041d",
    listingPrice: 850,
    listingStatus: ListingStatus.RESERVED,
    stage: "MEETUP_PLANNED",
    participants: [
      { id: CURRENT_USER_ID, name: "You", isVerified: true },
      { id: "user-3", name: "Priya M.", avatar: "https://i.pravatar.cc/150?u=user3", isVerified: true },
    ],
    lastMessage: {
      content: "Meetup planned for tomorrow 10 AM at Library",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      senderId: "system",
      type: "SYSTEM"
    },
    unreadCount: 0,
    isArchived: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  }
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      conversationId: "conv-1",
      senderId: "user-2",
      type: "TEXT",
      content: "Is this still available?",
      status: MessageStatus.READ,
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "msg-1-2",
      conversationId: "conv-1",
      senderId: CURRENT_USER_ID,
      type: "TEXT",
      content: "Yes, it is!",
      status: MessageStatus.READ,
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "msg-1-3",
      conversationId: "conv-1",
      senderId: "user-2",
      type: "TEXT",
      content: "Would you take 400 for it?",
      status: MessageStatus.DELIVERED, // Unread by me
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    }
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      conversationId: "conv-2",
      senderId: CURRENT_USER_ID,
      type: "TEXT",
      content: "Hey, I'm interested in the calculator.",
      status: MessageStatus.READ,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "msg-2-2",
      conversationId: "conv-2",
      senderId: "user-3",
      type: "TEXT",
      content: "Sure, when can you meet?",
      status: MessageStatus.READ,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    },
    {
      id: "msg-2-3",
      conversationId: "conv-2",
      senderId: "system",
      type: "RESERVATION",
      content: "Item reserved for You",
      status: MessageStatus.READ,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    },
    {
      id: "msg-2-4",
      conversationId: "conv-2",
      senderId: "system",
      type: "MEETUP",
      content: "Meetup planned for tomorrow 10 AM at Library",
      meetup: {
        id: "meetup-1",
        title: "Library Main Entrance",
        meetupTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        confirmedByBuyer: true,
        confirmedBySeller: true,
      },
      status: MessageStatus.READ,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    }
  ]
};
