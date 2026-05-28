"use client";

import { Bell, Lock, Trash2, Moon, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

const NOTIFICATION_PREFS = [
  { id: "new_message",   label: "New messages",           desc: "When someone sends you a chat message" },
  { id: "listing_interest", label: "Listing interest",   desc: "When someone is interested in your listing" },
  { id: "exchange_update", label: "Exchange updates",    desc: "QR session and meetup notifications" },
  { id: "price_drop",    label: "Price drops",           desc: "When a saved listing drops in price" },
];

export default function DashboardSettingsPage() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    new_message: true,
    listing_interest: true,
    exchange_update: true,
    price_drop: false,
  });

  const toggle = (id: string) =>
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-[var(--cc-text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--cc-text-secondary)] mt-0.5">
          Manage your account preferences
        </p>
      </div>

      {/* Notifications */}
      <div className="surface p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-[var(--cc-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--cc-text-primary)]">Notifications</h2>
        </div>
        <div className="space-y-3">
          {NOTIFICATION_PREFS.map(({ id, label, desc }) => (
            <div
              key={id}
              className="flex items-center justify-between gap-4 py-2 border-b border-[var(--cc-border-subtle)] last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-[var(--cc-text-primary)]">{label}</p>
                <p className="text-xs text-[var(--cc-text-secondary)] mt-0.5">{desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(id)}
                className="shrink-0"
                aria-label={`Toggle ${label}`}
              >
                {notifications[id] ? (
                  <ToggleRight className="h-7 w-7 text-[var(--cc-primary)]" />
                ) : (
                  <ToggleLeft className="h-7 w-7 text-[var(--cc-text-disabled)]" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="surface p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4 text-[var(--cc-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--cc-text-primary)]">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--cc-text-primary)]">Change Password</p>
              <p className="text-xs text-[var(--cc-text-secondary)] mt-0.5">
                Last changed 30 days ago
              </p>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="surface p-5 border border-[var(--cc-error-border)]">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="h-4 w-4 text-[var(--cc-error)]" />
          <h2 className="text-sm font-semibold text-[var(--cc-error)]">Danger Zone</h2>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--cc-text-primary)]">Delete Account</p>
            <p className="text-xs text-[var(--cc-text-secondary)] mt-0.5">
              Permanently delete your account and all listings. This action cannot be undone.
            </p>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 border-[var(--cc-error)] text-[var(--cc-error)] hover:bg-[var(--cc-error-subtle)]">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
