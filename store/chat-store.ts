import { create } from "zustand";
import type { Conversation, ChatMessage } from "@/types/chat";
import { MessageStatus } from "@/types/enums";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/mock/chats";

export const CURRENT_USER_ID = "current-user";

export interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  pendingMessages: Record<string, ChatMessage[]>;
  
  setActiveConversation: (id: string | null) => void;
  setConversations: (conversations: Conversation[]) => void;
  setMessages: (conversationId: string, messages: ChatMessage[]) => void;
  addMessage: (conversationId: string, message: ChatMessage) => void;
  
  sendMessageOptimistic: (conversationId: string, content: string, clientTempId: string) => void;
  reconcileMessage: (conversationId: string, clientTempId: string, serverMessage: ChatMessage) => void;
  markMessageFailed: (conversationId: string, clientTempId: string) => void;
  
  markAsRead: (conversationId: string) => void;
  updateConversationUnreadCount: (conversationId: string, count: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: null,
  messages: MOCK_MESSAGES,
  pendingMessages: {},

  setActiveConversation: (id) => set({ activeConversationId: id }),
  setConversations: (conversations) => set({ conversations }),
  
  setMessages: (conversationId, messages) => set((state) => ({
    messages: {
      ...state.messages,
      [conversationId]: messages,
    }
  })),

  addMessage: (conversationId, message) => set((state) => {
    // Prevent duplicate rendering if already exists by serverMessageId
    const currentMessages = state.messages[conversationId] || [];
    if (currentMessages.some(m => m.id === message.id)) {
      return state;
    }
    
    // Also remove from pending if it somehow matches a clientTempId implicitly
    // Just blindly appending here for realtime broadcasts
    
    return {
      messages: {
        ...state.messages,
        [conversationId]: [...currentMessages, message],
      }
    };
  }),

  sendMessageOptimistic: (conversationId, content, clientTempId) => {
    const newMessage: ChatMessage = {
      id: clientTempId,
      conversationId,
      senderId: CURRENT_USER_ID,
      type: "TEXT",
      content,
      status: MessageStatus.SENDING,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      pendingMessages: {
        ...state.pendingMessages,
        [conversationId]: [...(state.pendingMessages[conversationId] || []), newMessage],
      }
    }));
  },

  reconcileMessage: (conversationId, clientTempId, serverMessage) => {
    set((state) => {
      const pending = state.pendingMessages[conversationId] || [];
      const newPending = pending.filter((m) => m.id !== clientTempId);
      
      const currentMessages = state.messages[conversationId] || [];
      // Prevent duplicates
      if (currentMessages.some(m => m.id === serverMessage.id)) {
        return {
          pendingMessages: {
            ...state.pendingMessages,
            [conversationId]: newPending,
          }
        };
      }

      return {
        pendingMessages: {
          ...state.pendingMessages,
          [conversationId]: newPending,
        },
        messages: {
          ...state.messages,
          [conversationId]: [...currentMessages, serverMessage],
        },
      };
    });
  },

  markMessageFailed: (conversationId, clientTempId) => {
    set((state) => {
      const pending = state.pendingMessages[conversationId] || [];
      return {
        pendingMessages: {
          ...state.pendingMessages,
          [conversationId]: pending.map((msg) => 
            msg.id === clientTempId ? { ...msg, status: MessageStatus.FAILED } : msg
          ),
        }
      };
    });
  },

  markAsRead: (conversationId) => {
    set((state) => {
      const conversations = state.conversations.map(conv => 
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      );
      
      return { conversations };
    });
  },
  
  updateConversationUnreadCount: (conversationId, count) => {
    set((state) => {
      const conversations = state.conversations.map(conv => 
        conv.id === conversationId ? { ...conv, unreadCount: count } : conv
      );
      
      return { conversations };
    });
  }
}));
