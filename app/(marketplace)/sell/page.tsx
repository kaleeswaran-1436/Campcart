"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSellFlowStore } from "@/store/sell-flow-store";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";
import { SellProgress } from "@/components/sell/SellProgress";
import { SellBottomBar } from "@/components/sell/SellBottomBar";
import { DraftRecovery } from "@/components/sell/DraftRecovery";
import { ImageUploadStep } from "@/components/sell/steps/ImageUploadStep";
import { ItemDetailsStep } from "@/components/sell/steps/ItemDetailsStep";
import { PricingConditionStep } from "@/components/sell/steps/PricingConditionStep";
import { PreviewPublishStep, PublishSuccess } from "@/components/sell/steps/PreviewPublishStep";
import { uploadListingImage } from "@/lib/supabase/storage";

export default function SellPage() {
  const router = useRouter();
  const { toast } = useNotificationStore();
  const { isAuthenticated } = useAuthStore();
  const { currentStep, isDraftRecovered, setStep, resetFlow, draftData, images } = useSellFlowStore();
  const [mounted, setMounted] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // Hydration safety
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && mounted) {
      router.replace("/login?redirect=/sell");
    }
  }, [isAuthenticated, mounted, router]);

  if (!mounted) return null;

  // Show Draft Recovery if there's unrecovered data
  if (!isDraftRecovered && (draftData.title || draftData.description)) {
    return <DraftRecovery onResolved={() => {}} />;
  }

  if (isPublished) {
    return <PublishSuccess onReset={() => {
      resetFlow();
      setIsPublished(false);
    }} />;
  }

  const getValidationState = () => {
    if (currentStep === "images") return images.length > 0;
    return true;
  };

  const handleMobileNext = () => {
    if (currentStep === "images") {
      setStep("details");
    } else if (currentStep === "details") {
      document.getElementById("details-form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    } else if (currentStep === "pricing") {
      document.getElementById("pricing-form")?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
    }
  };

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      setPublishError(null);

      // 1. Upload images to Supabase Storage
      const uploadedUrls: string[] = [];
      for (const image of images) {
        if (image.file) {
          try {
            const result = await uploadListingImage(image.file);
            uploadedUrls.push(result.url);
          } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to upload image";
            toast.error("Image upload failed", message);
            throw error;
          }
        }
      }

      // 2. Create listing via API
      const listingData = {
        title: draftData.title,
        description: draftData.description,
        price: draftData.price,
        originalPrice: draftData.originalPrice,
        category: draftData.category,
        condition: draftData.condition,
        negotiable: draftData.negotiable,
        tags: draftData.tags,
        department: draftData.department,
        imageUrls: uploadedUrls,
      };

      const response = await fetch("/api/listings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create listing");
      }

      const { listing } = await response.json();
      
      toast.success("Listing published!", `Your item "${listing.title}" is now live.`);

      setIsPublished(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to publish listing";
      setPublishError(message);
      toast.error("Failed to publish", message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full pb-24 md:pb-8">
      <SellProgress />
      
      <div className="flex-1 w-full px-4 sm:px-0 mt-6">
        {currentStep === "images" && <ImageUploadStep onNext={() => setStep("details")} />}
        {currentStep === "details" && <ItemDetailsStep onNext={() => setStep("pricing")} onBack={() => setStep("images")} />}
        {currentStep === "pricing" && <PricingConditionStep onNext={() => setStep("preview")} onBack={() => setStep("details")} />}
        {currentStep === "preview" && <PreviewPublishStep onPublish={handlePublish} onBack={() => setStep("pricing")} />}
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden">
        <SellBottomBar 
          onNext={handleMobileNext} 
          onPublish={handlePublish}
          isValid={getValidationState()}
          isPublishing={isPublishing}
        />
      </div>
    </div>
  );
}
