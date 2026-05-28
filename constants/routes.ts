/* ─────────────────────────────────────────────────────────────
   CampCart — Typed App Routes
   Never hardcode URL strings — always use APP_ROUTES.
   ───────────────────────────────────────────────────────────── */

export const APP_ROUTES = {
  /* ── Public ─────────────────────────────────────────────── */
  home:       "/",
  browse:     "/browse",
  listing:    (idOrSlug: string) => `/browse/${idOrSlug}` as const,

  /* ── Auth ───────────────────────────────────────────────── */
  login:           "/login",
  register:        "/register",
  verify:          "/verify",
  verifyPending:   "/verify/pending",
  verifyRejected:  "/verify/rejected",
  forgotPassword:  "/forgot-password",
  resetPassword:   (token: string) => `/reset-password/${token}` as const,


  /* ── Marketplace ────────────────────────────────────────── */
  category:   (slug: string) => `/browse?category=${slug}` as const,
  search:     (q: string)    => `/browse?q=${encodeURIComponent(q)}` as const,
  sell:       "/sell",
  exchanges:  "/exchanges",
  exchange:   (id: string)   => `/exchanges/${id}` as const,
  chats:      "/chats",
  chat:       (id: string)   => `/chats/${id}` as const,

  /* ── Dashboard ──────────────────────────────────────────── */
  dashboard:          "/dashboard",
  dashboardListings:  "/dashboard/listings",
  dashboardChats:     "/dashboard/chats",
  dashboardProfile:   "/dashboard/profile",
  dashboardSettings:  "/dashboard/settings",

  /* ── Profile ────────────────────────────────────────────── */
  profile: (id: string) => `/profile/${id}` as const,

  /* ── Admin ──────────────────────────────────────────────── */
  admin:            "/admin",
  adminUsers:       "/admin/users",
  adminListings:    "/admin/listings",
  adminModeration:  "/admin/moderation",

  /* ── Static ─────────────────────────────────────────────── */
  help:     "/help",
  safety:   "/safety",
  privacy:  "/privacy",
  terms:    "/terms",
  contact:  "/contact",
} as const;

export type AppRoute = typeof APP_ROUTES;
