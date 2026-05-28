import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

/* ── Fonts ──────────────────────────────────────────────── */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ── Metadata ───────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "CampCart — Student Marketplace",
    template: "%s | CampCart",
  },
  description:
    "CampCart is the verified student marketplace for buying and selling books, calculators, lab materials, and more — with QR-based secure exchanges.",
  keywords: [
    "student marketplace",
    "campus buy sell",
    "textbook exchange",
    "lab materials",
    "college marketplace",
    "QR exchange",
  ],
  authors: [{ name: "CampCart" }],
  creator: "CampCart",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CampCart",
    title: "CampCart — Student Marketplace",
    description:
      "Verified student marketplace for books, calculators, lab materials, and QR-based exchanges.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampCart — Student Marketplace",
    description: "The verified student marketplace.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1B1F23",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ── Root Layout ─────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[var(--cc-bg)] text-[var(--cc-text-primary)] transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
