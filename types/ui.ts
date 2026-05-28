import type { ID } from "./listing";
import type { ToastType } from "./enums";

/* ── Toast ─────────────────────────────────────────────────── */
export interface ToastItem {
  id: ID;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;        // ms, default 4000
  action?: { label: string; onClick: () => void };
}

/* ── Modal ─────────────────────────────────────────────────── */
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalState {
  isOpen: boolean;
  title?: string;
  size?: ModalSize;
}

/* ── Drawer ────────────────────────────────────────────────── */
export type DrawerSide = "left" | "right" | "bottom";

/* ── Breadcrumb ────────────────────────────────────────────── */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}
