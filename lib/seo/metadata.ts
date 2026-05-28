import type { Metadata } from "next";

const APP_URL = process.env["NEXT_PUBLIC_APP_URL"] ?? "http://localhost:3000";
const APP_NAME = "CampCart";
const DEFAULT_DESCRIPTION =
  "CampCart is the verified student marketplace for buying and selling books, calculators, lab materials, and more — with QR-based secure exchanges.";

/* ─────────────────────────────────────────────────────────────
   SEO Metadata Helpers
   ───────────────────────────────────────────────────────────── */

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  /** Absolute URL or path */
  canonicalPath?: string;
  ogImage?: string;
  noIndex?: boolean;
  /** Extra Open Graph fields */
  og?: Partial<{
    type: "website" | "article";
    siteName: string;
  }>;
}

/**
 * Generates full Next.js Metadata for a page.
 *
 * @example
 * export const metadata = generateMetadata({
 *   title: "Browse Listings",
 *   description: "Find textbooks, calculators, and lab materials.",
 *   canonicalPath: "/browse",
 * });
 */
export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
  ogImage,
  noIndex = false,
  og,
}: GenerateMetadataOptions = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${APP_NAME}`
    : `${APP_NAME} — Student Marketplace`;

  const canonical = canonicalPath
    ? `${APP_URL}${canonicalPath}`
    : APP_URL;

  const ogImageUrl = ogImage ?? `${APP_URL}/og-default.png`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(APP_URL),
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: og?.siteName ?? APP_NAME,
      type: og?.type ?? "website",
      locale: "en_IN",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/* ── Listing-specific metadata ───────────────────────────────── */
interface ListingMetadataOptions {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  imageUrl?: string;
  slug: string;
}

/**
 * Generates metadata for a single listing page, including product OG tags.
 */
export function generateListingMetadata({
  title,
  description,
  price,
  category,
  condition,
  imageUrl,
  slug,
}: ListingMetadataOptions): Metadata {
  const shortDesc = `${condition} ${category} for ₹${price.toLocaleString("en-IN")}. ${description.slice(0, 120)}`;

  return generateMetadata({
    title,
    description: shortDesc,
    canonicalPath: `/listings/${slug}`,
    ogImage: imageUrl,
  });
}

/* ── JSON-LD structured data ────────────────────────────────── */
export function generateListingJsonLd({
  title,
  description,
  price,
  imageUrl,
  slug,
}: Omit<ListingMetadataOptions, "category" | "condition">) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description,
    image: imageUrl,
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${APP_URL}/listings/${slug}`,
    },
    seller: {
      "@type": "Organization",
      name: APP_NAME,
      url: APP_URL,
    },
  };
}
