"use client";

import { useEffect, useRef, useState, use } from "react";
import { notFound } from "next/navigation";
import { useChatStore, CURRENT_USER_ID } from "@/store/chat-store";
import { ChatHeader } from "@/components/chats/ChatHeader";
import { MessageBubble } from "@/components/chats/MessageBubble";
import { MessageInput } from "@/components/chats/MessageInput";
import { ChatRoomSkeleton } from "@/components/chats/ChatSkeleton";
import { MeetupStatusBanner } from "@/components/chats/MeetupStatusBanner";
import { TransactionProgressTracker } from "@/components/chats/TransactionProgressTracker";
import { ExchangeConfirmationCard } from "@/components/chats/ExchangeConfirmationCard";


export default function ChatRoomPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = use(params);
  const {
    conversations,
    messages,
    pendingMessages,
    setActiveConversation,
    sendMessageOptimistic,
    reconcileMessage,
    markMessageFailed,
    markAsRead,
  } = useChatStore();

  const [isMounted, setIsMounted] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [buyerConfirmed, setBuyerConfirmed] = useState(false);
  const [sellerConfirmed, setSellerConfirmed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find((c) => c.id === chatId);
  const conversationMessages = messages[chatId] || [];
  const conversationPendingMessages = pendingMessages[chatId] || [];

  const allMessages = [...conversationMessages, ...conversationPendingMessages];

  // Determine if current user is buyer (the non-first participant in mock data)
  const isBuyer = conversation
    ? conversation.participants.findIndex((p) => p.id === CURRENT_USER_ID) !== 0
    : false;

  const showExchangeConfirmation =
    conversation?.stage === "MEETUP_PLANNED" && transactionId;

  useEffect(() => {
    setIsMounted(true);
    if (conversation) {
      setActiveConversation(chatId);
      markAsRead(chatId);
    }
    return () => setActiveConversation(null);
  }, [chatId, conversation, setActiveConversation, markAsRead]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages.length]);

  if (!isMounted) return <ChatRoomSkeleton />;
  if (!conversation) return notFound();

  const handleSend = async (content: string) => {
    const clientTempId = `temp-${Date.now()}`;
    sendMessageOptimistic(chatId, content, clientTempId);

    try {
      const res = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          clientTempId,
          senderId: CURRENT_USER_ID,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");

      const serverMessage = await res.json();

      reconcileMessage(chatId, clientTempId, {
        id: serverMessage.serverMessageId,
        conversationId: serverMessage.conversationId,
        senderId: serverMessage.senderId,
        type: serverMessage.messageType,
        content: serverMessage.content,
        status: serverMessage.messageStatus,
        createdAt: serverMessage.createdAt,
      });
    } catch (error) {
      console.error(error);
      markMessageFailed(chatId, clientTempId);
    }
  };

  const handleQRSuccess = (txId: string) => {
    setTransactionId(txId);
  };

  const handleExchangeConfirmed = (completed: boolean) => {
    if (isBuyer) setBuyerConfirmed(true);
    else setSellerConfirmed(true);

    if (completed) {
      setBuyerConfirmed(true);
      setSellerConfirmed(true);
    }
  };

  // Get the last meetup message for the banner
  const lastMeetupMsg = [...allMessages].reverse().find((m) => m.type === "MEETUP");
  const meetupTitle = lastMeetupMsg?.meetup?.title;
  const meetupTime = lastMeetupMsg?.meetup?.meetupTime;

  return (
    <div className="flex flex-col h-full bg-[var(--cc-bg)] overflow-hidden pb-16 md:pb-0">
      <ChatHeader
        conversation={conversation}
        transactionId={transactionId ?? undefined}
        onQRSuccess={handleQRSuccess}
      />

      {/* Transaction progress tracker for advanced stages */}
      {(conversation.stage === "RESERVED" ||
        conversation.stage === "MEETUP_PLANNED" ||
        conversation.stage === "COMPLETED") && (
        <TransactionProgressTracker
          stage={conversation.stage}
          className="bg-[var(--cc-surface)] border-b border-[var(--cc-border-subtle)]"
        />
      )}

      {/* Meetup status banner */}
      {(conversation.stage === "RESERVED" ||
        conversation.stage === "MEETUP_PLANNED" ||
        conversation.stage === "COMPLETED") && (
        <MeetupStatusBanner
          stage={conversation.stage}
          meetupTitle={meetupTitle}
          meetupTime={meetupTime}
          onActionClick={() => {
            // In a real app: open the meetup scheduler or QR modal
            // For now it triggers from ChatHeader buttons
          }}
        />
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0">
        <div className="flex-1" />
        {allMessages.length === 0 ? (
          <div className="text-center py-10 text-[var(--cc-text-secondary)] text-sm">
            No messages yet. Send a message to start the conversation!
          </div>
        ) : (
          <div className="flex flex-col">
            {allMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-1 shrink-0" />
          </div>
        )}
      </div>

      {/* Exchange confirmation card — shown when QR has been scanned */}
      {showExchangeConfirmation && (
        <ExchangeConfirmationCard
          transactionId={transactionId!}
          confirmerId={CURRENT_USER_ID}
          isBuyer={isBuyer}
          buyerConfirmed={buyerConfirmed}
          sellerConfirmed={sellerConfirmed}
          onConfirmed={handleExchangeConfirmed}
        />
      )}

      <MessageInput
        onSend={handleSend}
        disabled={conversation.stage === "COMPLETED" || conversation.stage === "CANCELLED"}
      />
    </div>
  );
}
