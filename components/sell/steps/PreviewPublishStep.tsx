"use client";


import { useSellFlowStore } from "@/store/sell-flow-store";
import { ListingCard } from "@/components/ui/ListingCard";
import { Button } from "@/components/ui/Button";
import { ListingStatus, type ListingCategory, type ProductCondition } from "@/types/enums";
import type { ListingPreview } from "@/types/listing";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes";

export function PreviewPublishStep({ onPublish, onBack }: { onPublish: () => void; onBack: () => void }) {
  const { draftData, images } = useSellFlowStore();
  
  // Transform draft data into a ListingPreview for the card
  const previewListing: ListingPreview = {
    id: "preview-123",
    slug: "preview-123",
    title: draftData.title || "Untitled Item",
    price: draftData.price || 0,
    originalPrice: draftData.originalPrice,
    category: draftData.category as ListingCategory,
    condition: draftData.condition as ProductCondition,
    status: ListingStatus.ACTIVE,
    images: images.map(img => ({
      id: img.id,
      url: img.previewUrl,
      alt: draftData.title || "Untitled Item",
      isPrimary: img.isPrimary
    })),
    saves: 0,
    createdAt: new Date().toISOString(),
    seller: {
      id: "current-user",
      name: "You",
      isVerified: true,
      rating: 5.0,
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto w-full pb-8">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-[var(--cc-text-primary)]">Preview Listing</h2>
        <p className="text-[var(--cc-text-secondary)]">This is how your item will appear in the marketplace.</p>
      </div>

      <div className="bg-[var(--cc-surface-alt)] p-6 rounded-2xl border border-[var(--cc-border)] flex justify-center">
        <div className="w-[280px]">
          <ListingCard listing={previewListing} />
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex justify-between mt-4">
        <Button variant="outline" size="lg" type="button" onClick={onBack} className="w-32">
          Back
        </Button>
        <Button variant="primary" size="lg" type="button" onClick={onPublish} className="w-48 bg-emerald-600 hover:bg-emerald-700 text-white">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          Publish Listing
        </Button>
      </div>
    </div>
  );
}

export function PublishSuccess({ onReset }: { onReset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      
      <h1 className="text-3xl font-black text-[var(--cc-text-primary)] mb-2 tracking-tight">
        Listing Published!
      </h1>
      <p className="text-[var(--cc-text-secondary)] mb-8 max-w-sm">
        Your item is now live in the CampCart marketplace. Other students can now see and reserve it.
      </p>

      <div className="flex flex-col sm:flex-row w-full max-w-md gap-3">
        <Button variant="outline" size="lg" onClick={onReset} className="w-full">
          Post Another Item
        </Button>
        <Button variant="primary" size="lg" onClick={() => router.push(APP_ROUTES.browse)} className="w-full">
          Go to Browse
        </Button>
      </div>
    </div>
  );
}
