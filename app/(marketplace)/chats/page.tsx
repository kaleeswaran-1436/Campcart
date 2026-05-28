"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chat-store";
import { ConversationCard } from "@/components/chats/ConversationCard";
import { EmptyChatState } from "@/components/chats/EmptyChatState";
import { ChatListSkeleton } from "@/components/chats/ChatSkeleton";

export default function ChatsListPage() {
  const { conversations, setActiveConversation } = useChatStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setActiveConversation(null); // Reset active chat on list view
  }, [setActiveConversation]);

  if (!isMounted) {
    return (
      <div className="flex flex-col h-full bg-[var(--cc-surface)] overflow-y-auto">
        <div className="p-4 border-b border-[var(--cc-border)] bg-[var(--cc-bg)] sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-[var(--cc-text-primary)]">Messages</h1>
        </div>
        <ChatListSkeleton />
      </div>
    );
  }

  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="flex flex-col h-full bg-[var(--cc-surface)] overflow-y-auto pb-20 md:pb-0">
      <div className="p-4 border-b border-[var(--cc-border)] bg-[var(--cc-bg)] sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-[var(--cc-text-primary)]">Messages</h1>
      </div>

      {sortedConversations.length === 0 ? (
        <EmptyChatState />
      ) : (
        <div className="flex flex-col">
          {sortedConversations.map((conv) => (
            <ConversationCard key={conv.id} conversation={conv} />
          ))}
        </div>
      )}
    </div>
  );
}
