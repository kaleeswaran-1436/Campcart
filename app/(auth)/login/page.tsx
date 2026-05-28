"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { GraduationCap, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { FormField, FormLabel, FormMessage } from "@/components/ui/Form";
import { createResolver } from "@/lib/forms/resolver";
import { loginSchema, type LoginFormValues } from "@/lib/forms/schemas/auth.schema";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { authService } from "@/services/auth.service";
import { isApiError } from "@/lib/api/error";
import { APP_ROUTES } from "@/constants/routes";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const nextPath     = searchParams.get("next") ?? APP_ROUTES.browse;

  const { setSession, setLoading, isLoading } = useAuthStore();
  const { toast }                              = useNotificationStore();

  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: createResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: LoginFormValues) {
    try {
      setLoading(true);
      const session = await authService.login({
        email: values.email,
        password: values.password,
      });
      setSession(session);
      toast.success("Welcome back!", `Signed in as ${session.user.name}`);
      router.push(nextPath);
    } catch (err) {
      if (isApiError(err)) {
        if (err.isUnauthorized) {
          setError("password", { message: "Incorrect email or password" });
        } else {
          toast.error("Sign in failed", err.userMessage);
        }
      } else {
        toast.error("Sign in failed", "An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  const busy = isSubmitting || isLoading;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Logo */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--cc-bg-inverse)] text-[var(--cc-primary)]">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-xl font-black text-[var(--cc-text-primary)] tracking-tight">
            Camp<span className="text-[var(--cc-primary)]">Cart</span>
          </span>
        </div>
      </div>

      {/* Card */}
      <div className="surface p-6 space-y-5">
        <div>
          <h1 className="text-lg font-bold text-[var(--cc-text-primary)]">Welcome back</h1>
          <p className="text-sm text-[var(--cc-text-secondary)] mt-0.5">
            Sign in to your campus account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {/* Email */}
          <FormField name="email">
            <FormLabel required>College Email</FormLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--cc-text-secondary)] pointer-events-none" aria-hidden />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@college.edu"
                error={!!errors.email}
                className="pl-9"
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </div>
            <FormMessage />
          </FormField>

          {/* Password */}
          <FormField name="password">
            <div className="flex items-center justify-between">
              <FormLabel required>Password</FormLabel>
              <Link
                href={APP_ROUTES.forgotPassword}
                className="text-xs text-[var(--cc-primary)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              error={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            <FormMessage />
          </FormField>

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-[var(--cc-border)] accent-[var(--cc-primary)]"
            />
            <span className="text-sm text-[var(--cc-text-secondary)]">Remember me</span>
          </label>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={busy}
            disabled={busy}
            className="mt-2"
          >
            {busy ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--cc-border-subtle)]" />
          <span className="text-xs text-[var(--cc-text-disabled)]">or</span>
          <div className="flex-1 h-px bg-[var(--cc-border-subtle)]" />
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-2.5 rounded-lg bg-[var(--cc-info-subtle)] border border-[var(--cc-info-border)] p-3">
          <AlertCircle className="h-4 w-4 text-[var(--cc-info)] shrink-0 mt-0.5" aria-hidden />
          <p className="text-xs text-[var(--cc-info-fg)] leading-relaxed">
            Use your <strong>college email address</strong> to sign in.
            Only verified students can access CampCart.
          </p>
        </div>
      </div>

      {/* Footer link */}
      <p className="text-center text-sm text-[var(--cc-text-secondary)]">
        New to CampCart?{" "}
        <Link href={APP_ROUTES.register} className="text-[var(--cc-primary)] font-semibold hover:underline">
          Create account
        </Link>
      </p>
    </div>
  );
}
