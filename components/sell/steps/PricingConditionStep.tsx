"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSellFlowStore } from "@/store/sell-flow-store";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ProductCondition } from "@/types/enums";
import { cn } from "@/utils/cn";

const pricingSchema = z.object({
  price: z.number({ message: "Price must be a number" }).min(0, "Price cannot be negative").max(1000000, "Price is too high"),
  originalPrice: z.number().min(0).max(1000000).optional().or(z.literal("")),
  condition: z.nativeEnum(ProductCondition, { message: "Please select a condition" }),
  negotiable: z.boolean(),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

export function PricingConditionStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { draftData, updateDraft } = useSellFlowStore();

  const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      price: draftData.price,
      originalPrice: draftData.originalPrice || "",
      condition: draftData.condition as ProductCondition | undefined,
      negotiable: draftData.negotiable || false,
    },
    mode: "onChange",
  });

  const selectedCondition = watch("condition");
  const isNegotiable = watch("negotiable");

  const onSubmit = (data: PricingFormValues) => {
    // Clean up originalPrice empty string to undefined
    const cleanedData = {
      ...data,
      originalPrice: data.originalPrice === "" ? undefined : data.originalPrice,
    };
    updateDraft(cleanedData);
    onNext();
  };

  return (
    <form id="pricing-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold text-[var(--cc-text-primary)]">Pricing & Condition</h2>
        <p className="text-[var(--cc-text-secondary)]">Set a fair price to sell your item faster.</p>
      </div>

      <div className="space-y-6">
        {/* Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--cc-text-primary)]">Selling Price (₹)</label>
            <Input 
              {...register("price", { valueAsNumber: true })}
              type="number"
              placeholder="0"
              error={!!errors.price}
            />
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--cc-text-primary)]">Original Price (Optional)</label>
            <Input 
              {...register("originalPrice", { 
                setValueAs: v => v === "" ? "" : parseFloat(v) 
              })}
              type="number"
              placeholder="0"
              error={!!errors.originalPrice}
            />
            {errors.originalPrice && <p className="text-sm text-red-500 mt-1">{errors.originalPrice.message}</p>}
          </div>
        </div>

        {/* Negotiable Toggle */}
        <div 
          className="flex items-center justify-between p-4 rounded-xl border border-[var(--cc-border)] bg-[var(--cc-surface-alt)] cursor-pointer select-none"
          onClick={() => setValue("negotiable", !isNegotiable, { shouldValidate: true })}
        >
          <div className="flex flex-col">
            <span className="font-semibold text-[var(--cc-text-primary)]">Negotiable</span>
            <span className="text-sm text-[var(--cc-text-secondary)]">Allow buyers to make offers</span>
          </div>
          <div className={cn("w-12 h-6 rounded-full transition-colors relative", isNegotiable ? "bg-[var(--cc-primary)]" : "bg-gray-300")}>
            <div className={cn("absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform", isNegotiable && "translate-x-6")} />
          </div>
        </div>

        {/* Condition Cards */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--cc-text-primary)]">Condition</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(ProductCondition).map((cond) => {
              const isSelected = selectedCondition === cond;
              return (
                <div
                  key={cond}
                  onClick={() => setValue("condition", cond, { shouldValidate: true })}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all text-center flex flex-col items-center justify-center min-h-[80px]",
                    isSelected 
                      ? "border-[var(--cc-primary)] bg-[var(--cc-primary)]/5" 
                      : "border-[var(--cc-border)] bg-[var(--cc-surface-alt)] hover:border-[var(--cc-border-subtle)]"
                  )}
                >
                  <span className={cn("font-bold capitalize", isSelected ? "text-[var(--cc-primary)]" : "text-[var(--cc-text-primary)]")}>
                    {cond.replace("-", " ")}
                  </span>
                </div>
              );
            })}
          </div>
          {errors.condition && <p className="text-sm text-red-500 mt-1">{errors.condition.message}</p>}
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex justify-between mt-4">
        <Button variant="outline" size="lg" type="button" onClick={onBack} className="w-32">
          Back
        </Button>
        <Button variant="primary" size="lg" type="submit" disabled={!isValid} className="w-32">
          Preview
        </Button>
      </div>
    </form>
  );
}
