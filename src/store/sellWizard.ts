import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type SellStep = 'basics' | 'media' | 'review';

export interface ProductBasics {
  title: string;
  description: string;
  category: string;
  price: number;
  condition: 'new' | 'like-new' | 'good' | 'fair';
}

export interface ProductMedia {
  images: File[];
  previewUrls: string[];
}

export interface SellWizardState {
  // Step 1: Basics
  basics: ProductBasics;
  setBasics: (basics: Partial<ProductBasics>) => void;

  // Step 2: Media
  media: ProductMedia;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  setPreviewUrls: (urls: string[]) => void;

  // Wizard navigation
  currentStep: SellStep;
  setCurrentStep: (step: SellStep) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Form validation
  isBasicsValid: () => boolean;
  isMediaValid: () => boolean;

  // Reset wizard
  resetWizard: () => void;

  // Complete wizard
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

const INITIAL_BASICS: ProductBasics = {
  title: '',
  description: '',
  category: '',
  price: 0,
  condition: 'good',
};

const INITIAL_MEDIA: ProductMedia = {
  images: [],
  previewUrls: [],
};

const STEP_ORDER: SellStep[] = ['basics', 'media', 'review'];

export const useSellWizard = create<SellWizardState>()(
  devtools(
    (set, get) => ({
      // Basics state
      basics: INITIAL_BASICS,
      setBasics: (newBasics) =>
        set(
          (state) => ({
            basics: { ...state.basics, ...newBasics },
          }),
          false,
          'setBasics'
        ),

      // Media state
      media: INITIAL_MEDIA,
      addImage: (file) =>
        set(
          (state) => ({
            media: {
              ...state.media,
              images: [...state.media.images, file],
            },
          }),
          false,
          'addImage'
        ),
      removeImage: (index) =>
        set(
          (state) => ({
            media: {
              images: state.media.images.filter((_, i) => i !== index),
              previewUrls: state.media.previewUrls.filter((_, i) => i !== index),
            },
          }),
          false,
          'removeImage'
        ),
      setPreviewUrls: (urls) =>
        set(
          (state) => ({
            media: { ...state.media, previewUrls: urls },
          }),
          false,
          'setPreviewUrls'
        ),

      // Wizard navigation
      currentStep: 'basics',
      setCurrentStep: (step) =>
        set(
          () => ({
            currentStep: step,
          }),
          false,
          'setCurrentStep'
        ),
      nextStep: () => {
        const state = get();
        const currentIndex = STEP_ORDER.indexOf(state.currentStep);
        if (currentIndex < STEP_ORDER.length - 1) {
          set(
            () => ({
              currentStep: STEP_ORDER[currentIndex + 1],
            }),
            false,
            'nextStep'
          );
        }
      },
      previousStep: () => {
        const state = get();
        const currentIndex = STEP_ORDER.indexOf(state.currentStep);
        if (currentIndex > 0) {
          set(
            () => ({
              currentStep: STEP_ORDER[currentIndex - 1],
            }),
            false,
            'previousStep'
          );
        }
      },

      // Validation
      isBasicsValid: () => {
        const state = get();
        const { title, description, category, price } = state.basics;
        return title.trim().length > 0 && description.trim().length > 0 && category.length > 0 && price > 0;
      },
      isMediaValid: () => {
        const state = get();
        return state.media.images.length > 0;
      },

      // Reset
      resetWizard: () =>
        set(
          () => ({
            basics: INITIAL_BASICS,
            media: INITIAL_MEDIA,
            currentStep: 'basics',
            isSubmitting: false,
          }),
          false,
          'resetWizard'
        ),

      // Submission state
      isSubmitting: false,
      setIsSubmitting: (value) =>
        set(
          () => ({
            isSubmitting: value,
          }),
          false,
          'setIsSubmitting'
        ),
    }),
    {
      name: 'sell-wizard-store',
    }
  )
);
