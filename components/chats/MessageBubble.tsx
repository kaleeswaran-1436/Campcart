import { format } from "date-fns";
import { Check, CheckCheck, Clock, MapPin, Calendar, ShieldCheck } from "lucide-react";
import type { ChatMessage } from "@/types/chat";
import { MessageStatus } from "@/types/enums";
import { CURRENT_USER_ID } from "@/store/chat-store";
import { cn } from "@/utils/cn";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMine = message.senderId === CURRENT_USER_ID;
  const isSystem = message.type !== "TEXT";

  if (isSystem) {
    return (
      <div className="flex w-full justify-center my-6">
        <div className="bg-[var(--cc-surface-alt)] border border-[var(--cc-border)] rounded-2xl px-5 py-3 max-w-[85%] text-center">
          {message.type === "RESERVATION" && (
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-semibold text-[var(--cc-text-primary)]">Item Reserved</span>
              <span className="text-xs text-[var(--cc-text-secondary)]">{message.content}</span>
            </div>
          )}
          {message.type === "MEETUP" && message.meetup && (
            <div className="flex flex-col items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-semibold text-[var(--cc-text-primary)]">Meetup Planned</span>
              <div className="bg-white/50 rounded-lg p-2 text-left w-full text-xs text-[var(--cc-text-secondary)]">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-medium text-[var(--cc-text-primary)]">{message.meetup.title}</span>
                </div>
                {message.meetup.meetupTime && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(message.meetup.meetupTime), "MMM d, h:mm a")}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {message.type === "SYSTEM" && (
            <span className="text-xs text-[var(--cc-text-secondary)]">{message.content}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full mb-3", isMine ? "justify-end" : "justify-start")}>
      <div 
        className={cn(
          "relative max-w-[75%] px-4 py-2 text-[15px] leading-relaxed shadow-sm",
          isMine 
            ? "bg-[var(--cc-primary)] text-white rounded-2xl rounded-br-sm" 
            : "bg-[var(--cc-surface-alt)] text-[var(--cc-text-primary)] rounded-2xl rounded-bl-sm border border-[var(--cc-border-subtle)]"
        )}
      >
        <div className="break-words">{message.content}</div>
        
        <div className={cn("flex items-center justify-end gap-1 mt-1", isMine ? "text-white/80" : "text-[var(--cc-text-tertiary)]")}>
          <span className="text-[10px]">{format(new Date(message.createdAt), "h:mm a")}</span>
          
          {isMine && (
            <div className="flex items-center justify-center w-3 h-3">
              {message.status === MessageStatus.SENDING && <Clock className="w-3 h-3" />}
              {message.status === MessageStatus.SENT && <Check className="w-3 h-3" />}
              {(message.status === MessageStatus.DELIVERED || message.status === MessageStatus.READ) && (
                <CheckCheck className={cn("w-3.5 h-3.5", message.status === MessageStatus.READ && "text-blue-200")} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
