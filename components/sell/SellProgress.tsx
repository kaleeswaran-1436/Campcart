"use client";

import { useSellFlowStore } from "@/store/sell-flow-store";

export function SellProgress() {
  const { currentStep } = useSellFlowStore();

  const steps = [
    { id: "images", label: "Images" },
    { id: "details", label: "Details" },
    { id: "pricing", label: "Pricing" },
    { id: "preview", label: "Preview" },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full py-4 px-4 sm:px-0">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--cc-border-subtle)] w-full -z-10 rounded-full" />
        
        {/* Active Line (Progress) */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--cc-primary)] -z-10 rounded-full transition-all duration-300"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-[var(--cc-bg)] px-2">
              <div 
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold border-2 transition-colors duration-300 ${
                  isActive 
                    ? "border-[var(--cc-primary)] bg-[var(--cc-primary)] text-white" 
                    : isCompleted
                      ? "border-[var(--cc-primary)] bg-[var(--cc-bg)] text-[var(--cc-primary)]"
                      : "border-[var(--cc-border-subtle)] bg-[var(--cc-bg)] text-[var(--cc-text-disabled)]"
                }`}
              >
                {index + 1}
              </div>
              <span 
                className={`text-xs font-semibold hidden sm:block ${
                  isActive || isCompleted ? "text-[var(--cc-text-primary)]" : "text-[var(--cc-text-disabled)]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
