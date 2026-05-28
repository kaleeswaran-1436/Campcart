"use client";

import { FileEdit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSellFlowStore } from "@/store/sell-flow-store";
import { useEffect, useState } from "react";

export function DraftRecovery({ onResolved }: { onResolved: () => void }) {
  const { draftData, resetFlow, markDraftRecovered } = useSellFlowStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // We only want to show this if there's substantial data saved,
    // like at least a title or a description.
    if (draftData.title || draftData.description) {
      setShow(true);
    } else {
      markDraftRecovered();
      onResolved();
    }
  }, [draftData, markDraftRecovered, onResolved]);

  if (!show) return null;

  const handleContinue = () => {
    markDraftRecovered();
    onResolved();
  };

  const handleDiscard = () => {
    resetFlow();
    onResolved();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-500">
        <FileEdit className="h-10 w-10" />
      </div>
      
      <h1 className="text-2xl font-bold text-[var(--cc-text-primary)] mb-2">
        You have an unsaved draft
      </h1>
      <p className="text-[var(--cc-text-secondary)] mb-8 max-w-sm">
        We found some details you were working on previously. Would you like to pick up where you left off?
      </p>

      <div className="flex flex-col w-full max-w-xs gap-3">
        <Button variant="primary" size="lg" onClick={handleContinue} className="w-full">
          Continue Draft
        </Button>
        <Button variant="outline" size="lg" onClick={handleDiscard} className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
          <Trash2 className="w-4 h-4 mr-2" />
          Discard and Start New
        </Button>
      </div>
    </div>
  );
}
