"use client";

import { useState } from "react";
import { OptimizedImage } from "@/components/ui/Image";
import { ListingStatus } from "@/types/enums";
import type { ListingImage } from "@/types/listing";
import { cn } from "@/utils/cn";

interface ImageGalleryProps {
  images: ListingImage[];
  status: ListingStatus;
  title: string;
}

export function ImageGallery({ images, status, title }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-square w-full rounded-2xl bg-[var(--cc-surface-alt)] flex items-center justify-center border border-[var(--cc-border-subtle)]">
        <span className="text-[var(--cc-text-disabled)]">No images available</span>
      </div>
    );
  }

  const primaryIndex = images.findIndex((img) => img.isPrimary) !== -1 
    ? images.findIndex((img) => img.isPrimary) 
    : 0;
  
  const [activeIndex, setActiveIndex] = useState(primaryIndex);
  
  const activeImage = images[activeIndex] || images[0]!;
  const isSoldOrReserved = status === ListingStatus.SOLD || status === ListingStatus.RESERVED;

  return (
    <div className="flex flex-col gap-3">
      {/* Primary Image Viewer */}
      <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-square w-full overflow-hidden rounded-2xl border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)]">
        <OptimizedImage
          src={activeImage.url}
          alt={activeImage.alt || title}
          fill
          objectFit="contain" // Contain so full image is visible
          className={cn(
            "transition-all duration-300",
            isSoldOrReserved && "grayscale opacity-80"
          )}
        />
        
        {/* Status Overlays */}
        {status === ListingStatus.SOLD && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
            <span className="rounded-xl border-2 border-white bg-black/60 px-6 py-2 text-2xl font-black tracking-widest text-white shadow-xl rotate-[-12deg]">
              SOLD
            </span>
          </div>
        )}
        {status === ListingStatus.RESERVED && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-10">
            <span className="rounded-xl border-2 border-amber-400 bg-amber-500/80 px-6 py-2 text-2xl font-black tracking-widest text-white shadow-xl rotate-[-12deg]">
              RESERVED
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                activeIndex === idx
                  ? "border-[var(--cc-primary)] shadow-sm"
                  : "border-transparent opacity-60 hover:opacity-100 hover:border-[var(--cc-border-subtle)]"
              )}
            >
              <OptimizedImage
                src={img.url}
                alt={img.alt || `Thumbnail ${idx + 1}`}
                fill
                objectFit="cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
