"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { AlertCircle, User, BookOpen, Lock, ChevronRight, ChevronLeft } from "lucide-react";
import { AuthCard } from "@/components/ui/AuthCard";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { createResolver } from "@/lib/forms/resolver";
import { registerSchema, type RegisterFormValues } from "@/lib/forms/schemas/auth.schema";
import { DEPARTMENTS } from "@/constants/departments";
import { APP_ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { useNotificationStore } from "@/store/notification-store";

const STEPS = ["Personal", "Academic", "Security"];
const ACADEMIC_YEARS = [
  { value: "1", label: "1st Year" },
  { value: "2", label: "2nd Year" },
  { value: "3", label: "3rd Year" },
  { value: "4", label: "4th Year" },
  { value: "PG",  label: "Post Graduate" },
  { value: "PhD", label: "PhD / Research" },
];

/* ── Field wrapper ─────────────────────────────────────────── */
function FieldGroup({ label, id, error, children, required }: {
  label: string; id: string; error?: string;
  children: React.ReactNode; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-[var(--cc-text-primary)]"
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Input ─────────────────────────────────────────────────── */
function Field({
  id, type = "text", placeholder, registration, error, ...rest
}: {
  id: string; type?: string; placeholder?: string;
  registration: ReturnType<ReturnType<typeof useForm<RegisterFormValues>>["register"]>;
  error?: string;
  [k: string]: unknown;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        "w-full h-10 rounded-lg border px-3 text-sm",
        "bg-[var(--cc-surface-alt)] text-[var(--cc-text-primary)]",
        "placeholder:text-[var(--cc-text-muted)]",
        "transition-colors duration-150 outline-none",
        "focus:border-[var(--cc-honey)] focus:ring-2 focus:ring-[var(--cc-honey)]/20",
        error
          ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
          : "border-[var(--cc-border-subtle)]"
      )}
      {...registration}
      {...(rest as object)}
    />
  );
}

/* ── Select ────────────────────────────────────────────────── */
function SelectField({
  id, children, registration, error, placeholder,
}: {
  id: string; children: React.ReactNode;
  registration: ReturnType<ReturnType<typeof useForm<RegisterFormValues>>["register"]>;
  error?: string; placeholder?: string;
}) {
  return (
    <select
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      className={cn(
        "w-full h-10 rounded-lg border px-3 text-sm",
        "bg-[var(--cc-surface-alt)] text-[var(--cc-text-primary)]",
        "transition-colors duration-150 outline-none",
        "focus:border-[var(--cc-honey)] focus:ring-2 focus:ring-[var(--cc-honey)]/20",
        error
          ? "border-red-500/60 focus:border-red-500"
          : "border-[var(--cc-border-subtle)]"
      )}
      {...registration}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children}
    </select>
  );
}

/* ════════════════════════════════════════════════════════════
   Register Page
═══════════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useNotificationStore();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: createResolver(registerSchema),
    mode: "onTouched",
    defaultValues: {
      academicYear: undefined,
    },
  });

  /* ── Step validation gates ────────────────────────────────── */
  const STEP_FIELDS: (keyof RegisterFormValues)[][] = [
    ["name", "phone"],
    ["college", "rollNumber", "department", "academicYear"],
    ["email", "password", "confirmPassword"],
  ];

  async function goNext() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goPrev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  /* ── Submit ───────────────────────────────────────────────── */
  async function onSubmit(_data: RegisterFormValues) {
    setIsSubmitting(true);
    setApiError(null);
    try {
      // TODO: wire to authService.register(data)
      await new Promise((r) => setTimeout(r, 1200));
      toast.success("Account created! Please verify your student ID to get started.");
      router.push(APP_ROUTES.verify ?? "/verify");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setApiError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join the verified student marketplace"
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href={APP_ROUTES.login}
            className="text-[var(--cc-honey)] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {/* Step indicator */}
      <StepIndicator steps={STEPS} currentStep={step} className="mb-6" />

      <form
        id="register-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        {/* ── Step 0 — Personal Info ─────────────────────── */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-2 text-[var(--cc-honey)] mb-1">
              <User className="h-4 w-4" />
              <span className="text-sm font-semibold">Personal Information</span>
            </div>

            <FieldGroup label="Full Name" id="name" error={errors.name?.message} required>
              <Field
                id="name"
                placeholder="As on your college ID"
                registration={register("name")}
                error={errors.name?.message}
              />
            </FieldGroup>

            <FieldGroup label="Mobile Number" id="phone" error={errors.phone?.message}>
              <div className="flex gap-2">
                <span className="h-10 flex items-center px-3 rounded-lg border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)] text-sm text-[var(--cc-text-secondary)] shrink-0">
                  +91
                </span>
                <Field
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  registration={register("phone")}
                  error={errors.phone?.message}
                />
              </div>
            </FieldGroup>
          </div>
        )}

        {/* ── Step 1 — Academic Info ─────────────────────── */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-2 text-[var(--cc-honey)] mb-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-sm font-semibold">Academic Details</span>
            </div>

            <FieldGroup label="College Name" id="college" error={errors.college?.message} required>
              <Field
                id="college"
                placeholder="e.g. SRM Institute of Science & Technology"
                registration={register("college")}
                error={errors.college?.message}
              />
            </FieldGroup>

            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Roll Number" id="rollNumber" error={errors.rollNumber?.message} required>
                <Field
                  id="rollNumber"
                  placeholder="e.g. RA2211003010001"
                  registration={register("rollNumber")}
                  error={errors.rollNumber?.message}
                />
              </FieldGroup>

              <FieldGroup label="Academic Year" id="academicYear" error={errors.academicYear?.message} required>
                <SelectField
                  id="academicYear"
                  registration={register("academicYear")}
                  error={errors.academicYear?.message}
                  placeholder="Select year"
                >
                  {ACADEMIC_YEARS.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </SelectField>
              </FieldGroup>
            </div>

            <FieldGroup label="Department" id="department" error={errors.department?.message} required>
              <SelectField
                id="department"
                registration={register("department")}
                error={errors.department?.message}
                placeholder="Select your department"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </SelectField>
            </FieldGroup>
          </div>
        )}

        {/* ── Step 2 — Security ─────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="flex items-center gap-2 text-[var(--cc-honey)] mb-1">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-semibold">Account Security</span>
            </div>

            <FieldGroup label="College Email" id="email" error={errors.email?.message} required>
              <Field
                id="email"
                type="email"
                placeholder="yourname@college.edu"
                registration={register("email")}
                error={errors.email?.message}
              />
            </FieldGroup>

            <FieldGroup label="Password" id="password" error={errors.password?.message} required>
              <PasswordInput
                id="password"
                placeholder="Min 8 characters"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
              />
            </FieldGroup>

            <FieldGroup label="Confirm Password" id="confirmPassword" error={errors.confirmPassword?.message} required>
              <PasswordInput
                id="confirmPassword"
                placeholder="Repeat your password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
            </FieldGroup>

            {/* API error */}
            {apiError && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {apiError}
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-[var(--cc-text-muted)] text-center leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="underline hover:text-[var(--cc-honey)]">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline hover:text-[var(--cc-honey)]">Privacy Policy</Link>.
            </p>
          </div>
        )}
      </form>

      {/* ── Navigation Buttons ─────────────────────────────── */}
      <div className={`flex mt-6 gap-3 ${step > 0 ? "justify-between" : "justify-end"}`}>
        {step > 0 && (
          <Button
            variant="outline"
            size="md"
            onClick={goPrev}
            disabled={isSubmitting}
            type="button"
            id="register-back-btn"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}

        {step < STEPS.length - 1 ? (
          <Button
            variant="primary"
            size="md"
            onClick={goNext}
            type="button"
            id="register-next-btn"
            className="ml-auto"
          >
            Continue
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="md"
            type="submit"
            form="register-form"
            loading={isSubmitting}
            id="register-submit-btn"
          >
            {isSubmitting ? "Creating account…" : "Create Account"}
          </Button>
        )}
      </div>
    </AuthCard>
  );
}
