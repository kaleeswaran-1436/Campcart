"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSellFlowStore } from "@/store/sell-flow-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ListingCategory } from "@/types/enums";
import { DEPARTMENTS } from "@/constants/departments";

// Use a subset of the listing schema for this step
const detailsSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters").max(80, "Title must be under 80 characters")
    .refine(val => !/(.)\1{4,}/.test(val), "Please avoid excessive repeated characters"), // Anti-spam
  description: z.string().min(20, "Describe the item in at least 20 characters").max(1000, "Description is too long")
    .refine(val => !/(.)\1{4,}/.test(val), "Please avoid excessive repeated characters"),
  category: z.nativeEnum(ListingCategory, { message: "Please select a category" }),
  department: z.string().optional(),
});

type DetailsFormValues = z.infer<typeof detailsSchema>;

export function ItemDetailsStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draftData, updateDraft } = useSellFlowStore();

  const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      title: draftData.title || "",
      description: draftData.description || "",
      category: draftData.category as ListingCategory | undefined,
      department: draftData.department || "",
    },
    mode: "onChange",
  });

  const titleValue = watch("title") || "";
  const descValue = watch("description") || "";

  const onSubmit = (data: DetailsFormValues) => {
    updateDraft(data);
    onNext();
  };

  return (
    <form id="details-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold text-[var(--cc-text-primary)]">Item Details</h2>
        <p className="text-[var(--cc-text-secondary)]">Give your listing a clear title and description.</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--cc-text-primary)]">Title</label>
          <Input 
            {...register("title")}
            placeholder="e.g. Engineering Mathematics Vol 2"
            error={!!errors.title}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
          <div className="text-right text-xs text-[var(--cc-text-disabled)] mt-1">
            {titleValue.length}/80
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--cc-text-primary)]">Category</label>
          <select 
            {...register("category")}
            className="w-full h-11 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-surface-alt)] px-3 text-sm text-[var(--cc-text-primary)] outline-none focus:border-[var(--cc-primary)] focus:ring-1 focus:ring-[var(--cc-primary)]"
          >
            <option value="">Select a category...</option>
            {Object.values(ListingCategory).map((cat) => (
              <option key={cat} value={cat}>{cat.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
        </div>

        {/* Department */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--cc-text-primary)]">Department (Optional)</label>
          <select 
            {...register("department")}
            className="w-full h-11 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-surface-alt)] px-3 text-sm text-[var(--cc-text-primary)] outline-none focus:border-[var(--cc-primary)] focus:ring-1 focus:ring-[var(--cc-primary)]"
          >
            <option value="">Select department...</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.value} value={dept.value}>{dept.label}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--cc-text-primary)]">Description</label>
          <textarea 
            {...register("description")}
            rows={5}
            placeholder="Describe the condition, features, and reason for selling..."
            className="w-full rounded-lg border border-[var(--cc-border)] bg-[var(--cc-surface-alt)] p-3 text-sm text-[var(--cc-text-primary)] outline-none focus:border-[var(--cc-primary)] focus:ring-1 focus:ring-[var(--cc-primary)] resize-none"
          />
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-red-500">{errors.description?.message}</span>
            <span className="text-xs text-[var(--cc-text-disabled)]">{descValue.length}/1000</span>
          </div>
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex justify-between mt-4">
        <Button variant="outline" size="lg" type="button" onClick={onBack} className="w-32">
          Back
        </Button>
        <Button variant="primary" size="lg" type="submit" disabled={!isValid} className="w-32">
          Next Step
        </Button>
      </div>
    </form>
  );
}
