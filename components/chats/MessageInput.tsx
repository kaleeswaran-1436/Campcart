"use client";

import { useState, useRef } from "react";
import { Send, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [content, setContent] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!content.trim() || disabled) return;
    onSend(content.trim());
    setContent("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-[var(--cc-surface)] border-t border-[var(--cc-border)] p-3 pb-[env(safe-area-inset-bottom,12px)]">
      <div className="flex items-end gap-2 max-w-4xl mx-auto w-full">
        <Button 
          variant="ghost" 
          size="icon" 
          type="button" 
          className="shrink-0 text-[var(--cc-text-tertiary)] hover:text-[var(--cc-text-primary)] h-11 w-11"
          disabled={disabled}
        >
          <ImageIcon className="h-5 w-5" />
        </Button>
        
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message seller..."
            disabled={disabled}
            className="w-full rounded-2xl bg-[var(--cc-surface-alt)] border border-[var(--cc-border-subtle)] px-4 h-11 text-[15px] text-[var(--cc-text-primary)] placeholder-[var(--cc-text-disabled)] focus:outline-none focus:ring-2 focus:ring-[var(--cc-primary)]/20 focus:border-[var(--cc-primary)]/30 transition-all disabled:opacity-50"
          />
        </div>

        <Button 
          variant="primary" 
          size="icon" 
          type="button"
          onClick={handleSend}
          disabled={disabled || !content.trim()}
          className="shrink-0 rounded-full h-11 w-11"
        >
          <Send className="h-4 w-4 ml-0.5" />
        </Button>
      </div>
    </div>
  );
}
