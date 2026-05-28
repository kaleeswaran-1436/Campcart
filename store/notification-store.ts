"use client";

import { create } from "zustand";
import type { ToastItem } from "@/types/ui";
import type { NotificationType } from "@/types/enums";
import type { ID, Timestamp } from "@/types/listing";

const DEFAULT_TOAST_DURATION = 4000;
let toastCounter = 0;

/* ── In-app notification ────────────────────────────────────── */
interface AppNotification {
  id: ID;
  type: NotificationType;
  title: string;
  body?: string;
  href?: string;
  isRead: boolean;
  createdAt: Timestamp;
}

interface NotificationState {
  /* Toast queue */
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  /* Convenience toasters */
  toast: {
    success: (title: string, description?: string) => void;
    error: (title: string, description?: string) => void;
    warning: (title: string, description?: string) => void;
    info: (title: string, description?: string) => void;
  };

  /* In-app notifications */
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, "id" | "isRead" | "createdAt">) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => {
  function addToast(toast: Omit<ToastItem, "id">) {
    const id = `toast-${++toastCounter}`;
    const item: ToastItem = { ...toast, id, duration: toast.duration ?? DEFAULT_TOAST_DURATION };
    set((s) => ({ toasts: [...s.toasts, item] }));
    setTimeout(() => get().removeToast(id), item.duration);
  }

  return {
    /* ── Toasts ──────────────────────────────────────────────── */
    toasts: [],
    addToast,
    removeToast: (id) =>
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    clearToasts: () => set({ toasts: [] }),

    toast: {
      success: (title, description) => addToast({ type: "success", title, description }),
      error:   (title, description) => addToast({ type: "error",   title, description }),
      warning: (title, description) => addToast({ type: "warning", title, description }),
      info:    (title, description) => addToast({ type: "info",    title, description }),
    },

    /* ── Notifications ───────────────────────────────────────── */
    notifications: [],
    unreadCount: 0,

    addNotification: (n) => {
      const item: AppNotification = {
        ...n,
        id: `notif-${Date.now()}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      set((s) => ({
        notifications: [item, ...s.notifications].slice(0, 50),
        unreadCount: s.unreadCount + 1,
      }));
    },

    markRead: (id) =>
      set((s) => ({
        notifications: s.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, s.unreadCount - 1),
      })),

    markAllRead: () =>
      set((s) => ({
        notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      })),

    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
  };
});
