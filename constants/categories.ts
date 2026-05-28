import {
  BookOpen,
  Calculator,
  FlaskConical,
  PenLine,
  Laptop,
  FileText,
  Music,
  Shirt,
  Package,
} from "lucide-react";
import { type ListingCategory, ListingCategory as LC } from "@/types/enums";
import type { ComponentType } from "react";

/* ─────────────────────────────────────────────────────────────
   Listing Categories with display metadata
   ───────────────────────────────────────────────────────────── */

export interface CategoryMeta {
  value: ListingCategory;
  label: string;
  slug: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
  color: string;        // Tailwind bg class for icons
}

export const CATEGORIES: CategoryMeta[] = [
  {
    value:       LC.BOOKS,
    label:       "Books",
    slug:        "books",
    icon:        BookOpen,
    description: "Textbooks, reference books, novels",
    color:       "bg-blue-50 text-blue-700",
  },
  {
    value:       LC.CALCULATORS,
    label:       "Calculators",
    slug:        "calculators",
    icon:        Calculator,
    description: "Scientific, graphing calculators",
    color:       "bg-purple-50 text-purple-700",
  },
  {
    value:       LC.LAB_MATERIALS,
    label:       "Lab Materials",
    slug:        "lab-materials",
    icon:        FlaskConical,
    description: "Lab coats, glassware, equipment",
    color:       "bg-green-50 text-green-700",
  },
  {
    value:       LC.STATIONERY,
    label:       "Stationery",
    slug:        "stationery",
    icon:        PenLine,
    description: "Pens, notebooks, drawing tools",
    color:       "bg-yellow-50 text-yellow-700",
  },
  {
    value:       LC.ELECTRONICS,
    label:       "Electronics",
    slug:        "electronics",
    icon:        Laptop,
    description: "Laptops, phones, accessories",
    color:       "bg-slate-100 text-slate-700",
  },
  {
    value:       LC.NOTES,
    label:       "Notes & PDFs",
    slug:        "notes",
    icon:        FileText,
    description: "Handwritten notes, PDF bundles",
    color:       "bg-orange-50 text-orange-700",
  },
  {
    value:       LC.INSTRUMENTS,
    label:       "Instruments",
    slug:        "instruments",
    icon:        Music,
    description: "Musical instruments, drawing kits",
    color:       "bg-pink-50 text-pink-700",
  },
  {
    value:       LC.CLOTHING,
    label:       "Clothing",
    slug:        "clothing",
    icon:        Shirt,
    description: "College hoodies, uniforms",
    color:       "bg-teal-50 text-teal-700",
  },
  {
    value:       LC.OTHER,
    label:       "Other",
    slug:        "other",
    icon:        Package,
    description: "Anything else campus-related",
    color:       "bg-gray-50 text-gray-600",
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c])
) as Record<ListingCategory, CategoryMeta>;

/** Find category meta by slug (URL param) */
export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
