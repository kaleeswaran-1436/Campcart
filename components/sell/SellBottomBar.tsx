"use client";

import { Button } from "@/components/ui/Button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSellFlowStore, type SellStep } from "@/store/sell-flow-store";

interface SellBottomBarProps {
  onNext?: () => void;
  onBack?: () => void;
  onPublish?: () => void;
  isValid?: boolean;
  isPublishing?: boolean;
}

export function SellBottomBar({ onNext, onBack, onPublish, isValid = true, isPublishing = false }: SellBottomBarProps) {
  const { currentStep, setStep } = useSellFlowStore();

  const handleBack = () => {
    if (onBack) return onBack();

    const order: SellStep[] = ["images", "details", "pricing", "preview"];
    const currentIndex = order.indexOf(currentStep);
    if (currentIndex > 0) {
      setStep(order[currentIndex - 1] as SellStep);
    }
  };

  const showPublish = currentStep === "preview";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--cc-surface)]/95 backdrop-blur-md border-t border-[var(--cc-border-subtle)] p-4 pb-safe shadow-lg md:relative md:bg-transparent md:border-none md:shadow-none md:p-0 md:mt-8">
      <div className="flex items-center justify-between gap-3 max-w-2xl mx-auto w-full">
        <Button
          variant="outline"
          size="lg"
          onClick={handleBack}
          disabled={currentStep === "images" || isPublishing}
          className="flex-1 md:flex-none md:w-32"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {showPublish ? (
          <Button
            variant="primary"
            size="lg"
            onClick={onPublish}
            disabled={!isValid || isPublishing}
            className="flex-1 md:flex-none md:w-48 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isPublishing ? (
              "Publishing..."
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Publish Listing
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={onNext}
            disabled={!isValid}
            className="flex-1 md:flex-none md:w-32"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
