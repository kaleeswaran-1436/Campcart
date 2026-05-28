import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ListingFormValues } from "@/lib/forms/schemas/listing.schema";

export type SellStep = "images" | "details" | "pricing" | "preview";

export interface DraftImage {
  id: string;
  file?: File; // Present during active session
  previewUrl: string;
  isPrimary: boolean;
}

interface SellFlowState {
  currentStep: SellStep;
  draftData: Partial<ListingFormValues>;
  images: DraftImage[];
  isDraftRecovered: boolean;
  
  // Actions
  setStep: (step: SellStep) => void;
  updateDraft: (data: Partial<ListingFormValues>) => void;
  setImages: (images: DraftImage[]) => void;
  resetFlow: () => void;
  markDraftRecovered: () => void;
}

const DEFAULT_STATE = {
  currentStep: "images" as SellStep,
  draftData: {},
  images: [],
  isDraftRecovered: false,
};

export const useSellFlowStore = create<SellFlowState>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setStep: (step) => set({ currentStep: step }),
      
      updateDraft: (data) =>
        set((state) => ({ draftData: { ...state.draftData, ...data } })),
        
      setImages: (images) => set({ images }),
      
      resetFlow: () => set({ ...DEFAULT_STATE }),
      
      markDraftRecovered: () => set({ isDraftRecovered: true }),
    }),
    {
      name: "campcart-sell-draft",
      storage: createJSONStorage(() => localStorage),
      // We cannot securely serialize File objects or blob URLs to localStorage.
      // So we only persist the draft form data.
      partialize: (state) => ({
        draftData: state.draftData,
      }),
    }
  )
);
