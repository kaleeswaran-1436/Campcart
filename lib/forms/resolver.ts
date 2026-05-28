import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues } from "react-hook-form";

/* ─────────────────────────────────────────────────────────────
   Typed Zod resolver wrapper for React Hook Form
   ───────────────────────────────────────────────────────────── */

/**
 * Creates a typed resolver for react-hook-form from a Zod schema.
 * Reduces boilerplate at the call site.
 *
 * @example
 * const form = useForm({ resolver: createResolver(loginSchema) })
 */
export function createResolver<T extends z.ZodType<FieldValues>>(schema: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return zodResolver(schema as any);
}

/* ── Common reusable field schemas (Zod v4 compatible) ─────── */
export const emailField = z
  .string({ error: "Email is required" })
  .email("Enter a valid email address")
  .toLowerCase()
  .trim();

export const passwordField = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long");

export const nameField = z
  .string({ error: "Name is required" })
  .min(2, "Name must be at least 2 characters")
  .max(60, "Name is too long")
  .trim();

export const phoneField = z
  .string()
  .regex(/^\+?[0-9]{10,14}$/, "Enter a valid phone number")
  .optional();

export const priceField = z
  .number({ error: "Enter a valid price" })
  .min(1, "Price must be at least ₹1")
  .max(100_000, "Price seems too high");
