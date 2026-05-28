import { z } from "zod";
import { priceField, nameField } from "../resolver";
import { ListingCategory, ProductCondition } from "@/types/enums";

/* ── Create / Edit Listing ──────────────────────────────────── */
export const listingSchema = z.object({
  title: nameField
    .min(4, "Title must be at least 4 characters")
    .max(80, "Title must be under 80 characters"),

  description: z
    .string({ error: "Description is required" })
    .min(20, "Describe the item in at least 20 characters")
    .max(1000, "Description is too long"),

  price: priceField,

  originalPrice: z
    .number({ error: "Enter a valid number" })
    .min(0)
    .max(200_000)
    .optional(),

  category: z.enum(
    Object.values(ListingCategory) as [string, ...string[]]
  ).describe("Select a category"),

  condition: z.enum(
    Object.values(ProductCondition) as [string, ...string[]]
  ).describe("Select the item condition"),

  negotiable: z.boolean().default(false),

  tags: z
    .string()
    .transform((s) => s.split(",").map((t) => t.trim()).filter(Boolean))
    .pipe(z.string().array().max(10, "Max 10 tags"))
    .optional(),

  department: z.string().optional(),

  imageUrls: z
    .string()
    .url("Each image must be a valid URL")
    .array()
    .min(1, "Add at least one image")
    .max(6, "Maximum 6 images allowed"),
});

export type ListingFormValues = z.infer<typeof listingSchema>;
