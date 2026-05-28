import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CheckCheck } from "lucide-react";
import type { Conversation } from "@/types/chat";
import { CURRENT_USER_ID } from "@/store/chat-store";
import { APP_ROUTES } from "@/constants/routes";

interface ConversationCardProps {
  conversation: Conversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const otherParticipant = conversation.participants.find(p => p.id !== CURRENT_USER_ID) || conversation.participants[0]!;
  
  const formattedTime = conversation.lastMessage 
    ? formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })
    : "";

  return (
    <Link 
      href={APP_ROUTES.chat(conversation.id)}
      className="flex items-center gap-4 p-4 border-b border-[var(--cc-border-subtle)] hover:bg-[var(--cc-surface-hover)] transition-colors active:bg-[var(--cc-surface-alt)]"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--cc-surface-alt)]">
        {conversation.listingImageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={conversation.listingImageUrl} 
            alt={conversation.listingTitle}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            No Img
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-[var(--cc-text-primary)] truncate">
            {otherParticipant.name}
          </span>
          <span className="text-xs text-[var(--cc-text-tertiary)] shrink-0 ml-2">
            {formattedTime}
          </span>
        </div>
        
        <div className="text-sm font-medium text-[var(--cc-text-secondary)] truncate mb-0.5">
          {conversation.listingTitle}
        </div>
        
        <div className="flex items-center gap-1.5 text-sm text-[var(--cc-text-tertiary)] truncate">
          {conversation.lastMessage?.senderId === CURRENT_USER_ID && (
             <CheckCheck className="h-3.5 w-3.5 text-[var(--cc-text-tertiary)] shrink-0" />
          )}
          <span className="truncate">
            {conversation.lastMessage?.type === "SYSTEM" || conversation.lastMessage?.type === "RESERVATION" || conversation.lastMessage?.type === "MEETUP" 
              ? <span className="italic">System message</span>
              : conversation.lastMessage?.content || "No messages yet"}
          </span>
        </div>
      </div>

      {conversation.unreadCount > 0 && (
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--cc-primary)] text-[10px] font-bold text-white">
          {conversation.unreadCount}
        </div>
      )}
    </Link>
  );
}
