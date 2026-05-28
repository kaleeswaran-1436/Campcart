"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, X, GripVertical, AlertCircle } from "lucide-react";
import { useSellFlowStore, type DraftImage } from "@/store/sell-flow-store";
import { validateImage, MAX_IMAGES } from "@/utils/image";
import { Button } from "@/components/ui/Button";

export function ImageUploadStep({ onNext: _onNext }: { onNext: () => void }) {
  const { images, setImages, setStep } = useSellFlowStore();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    setError(null);

    const newFiles = Array.from(files);
    
    if (images.length + newFiles.length > MAX_IMAGES) {
      setError(`You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    const newDraftImages: DraftImage[] = [];

    for (const file of newFiles) {
      const validationError = validateImage(file);
      if (validationError) {
        setError(validationError);
        return; // Stop processing if one is invalid
      }
      
      newDraftImages.push({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl: URL.createObjectURL(file),
        isPrimary: images.length === 0 && newDraftImages.length === 0, // First image is cover
      });
    }

    setImages([...images, ...newDraftImages]);
  }, [images, setImages]);

  const removeImage = (id: string) => {
    const newImages = images.filter((img) => img.id !== id);
    // If we removed the primary, make the first one primary
    if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
      newImages[0]!.isPrimary = true;
    }
    setImages(newImages);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= images.length) return;
    const newImages = [...images];
    const temp = newImages[index]!;
    newImages[index] = newImages[index + direction]!;
    newImages[index + direction] = temp;
    
    // Reset primary status: first image is always primary in this simple implementation
    newImages.forEach((img, i) => img.isPrimary = i === 0);
    
    setImages(newImages);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleNext = () => {
    if (images.length > 0) {
      setStep("details");
    } else {
      setError("Please upload at least one image.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold text-[var(--cc-text-primary)]">Upload Images</h2>
        <p className="text-[var(--cc-text-secondary)]">Add up to 6 images. The first image will be your cover.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Dropzone */}
      {images.length < MAX_IMAGES && (
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--cc-border)] hover:border-[var(--cc-primary)] bg-[var(--cc-surface-alt)] hover:bg-[var(--cc-surface-hover)] rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 min-h-[200px]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--cc-primary)]/10 text-[var(--cc-primary)] mb-4">
            <UploadCloud className="h-8 w-8" />
          </div>
          <span className="text-[var(--cc-text-primary)] font-medium text-lg">Tap to upload or drag & drop</span>
          <span className="text-[var(--cc-text-secondary)] text-sm mt-1">JPG, PNG, WebP up to 5MB</span>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
          {images.map((img, idx) => (
            <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-[var(--cc-border-subtle)] bg-[var(--cc-surface-alt)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
              
              {img.isPrimary && (
                <div className="absolute top-2 left-2 bg-[var(--cc-primary)] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md z-10 shadow-sm">
                  Cover
                </div>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <button onClick={() => moveImage(idx, -1)} disabled={idx === 0} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30">
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeImage(img.id)} className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white shadow-sm">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-end">
                   <button onClick={() => moveImage(idx, 1)} disabled={idx === images.length - 1} className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white disabled:opacity-30">
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Next Button */}
      <div className="hidden md:flex justify-end mt-4">
        <Button variant="primary" size="lg" onClick={handleNext} disabled={images.length === 0} className="w-32">
          Next Step
        </Button>
      </div>
    </div>
  );
}
