"use client";

import {
  createContext,
  useContext,
  forwardRef,
  type HTMLAttributes,
  type LabelHTMLAttributes,
} from "react";
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { cn } from "@/utils/cn";

/* ═══════════════════════════════════════════════════════════════
   Form Primitives
   ═══════════════════════════════════════════════════════════════ */

/* ── FormField context ──────────────────────────────────────── */
type FormFieldContextValue = { name: string };
const FormFieldContext = createContext<FormFieldContextValue>({ name: "" });

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  name: TName;
  children: React.ReactNode;
}

/**
 * Wraps a form field, providing field name context to child components.
 *
 * @example
 * <FormField name="email">
 *   <FormLabel>Email</FormLabel>
 *   <Input type="email" {...register("email")} />
 *   <FormMessage />
 * </FormField>
 */
export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, children }: FormFieldProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <div className="flex flex-col gap-1.5">{children}</div>
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const { name } = useContext(FormFieldContext);
  const {
    formState: { errors },
    getFieldState,
  } = useFormContext();

  const fieldState = getFieldState(name);
  const error = errors[name];

  return { name, error, fieldState };
}

/* ── FormLabel ──────────────────────────────────────────────── */
export const FormLabel = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }
>(({ className, children, required = false, ...props }, ref) => {
  const { name, error } = useFormField();
  return (
    <label
      ref={ref}
      htmlFor={name}
      className={cn(
        "text-sm font-medium text-[var(--cc-text-primary)] leading-none",
        error && "text-[var(--cc-error)]",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-[var(--cc-error)]" aria-hidden>*</span>
      )}
    </label>
  );
});
FormLabel.displayName = "FormLabel";

/* ── FormMessage (error) ────────────────────────────────────── */
export const FormMessage = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error } = useFormField();
  const msg = error?.message as string | undefined;
  if (!msg && !children) return null;

  return (
    <p
      ref={ref}
      role="alert"
      className={cn(
        "text-xs font-medium text-[var(--cc-error)] flex items-center gap-1",
        className
      )}
      {...props}
    >
      <span aria-hidden>⚠</span>
      {msg ?? children}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

/* ── FormHint ───────────────────────────────────────────────── */
export const FormHint = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-[var(--cc-text-secondary)]", className)}
    {...props}
  />
));
FormHint.displayName = "FormHint";
