import { z } from "zod";
import { emailField, nameField, passwordField } from "../resolver";

/* ── Login ──────────────────────────────────────────────────── */
export const loginSchema = z.object({
  email:    emailField,
  password: passwordField,
});
export type LoginFormValues = z.infer<typeof loginSchema>;

/* ── Register ───────────────────────────────────────────────── */
export const registerSchema = z
  .object({
    name:            nameField,
    email:           emailField,
    password:        passwordField,
    confirmPassword: z.string({ error: "Please confirm your password" }),
    college:         z.string({ error: "College name is required" }).min(2).trim(),
    rollNumber:      z.string({ error: "Roll number is required" }).min(2).trim(),
    department:      z.string({ error: "Department is required" }),
    academicYear:    z.enum(["1", "2", "3", "4", "PG", "PhD"], {
                       error: "Select your academic year",
                     }),
    phone:           z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number").optional(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterFormValues = z.infer<typeof registerSchema>;

/* ── Forgot Password ────────────────────────────────────────── */
export const forgotPasswordSchema = z.object({
  email: emailField,
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/* ── Reset Password ─────────────────────────────────────────── */
export const resetPasswordSchema = z
  .object({
    password:        passwordField,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
