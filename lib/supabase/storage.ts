import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Supabase Storage Helpers
 * Manages listing image uploads, compression, and URL generation
 */

const STORAGE_BUCKET = "listing-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp"];

export interface UploadImageResult {
  url: string;
  path: string;
  fileName: string;
}

/**
 * Compress image before upload
 * Reduces file size while maintaining quality
 */
async function compressImage(file: File): Promise<Blob> {
  // Client-side compression using canvas API
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Scale down if larger than 1920px
        if (width > 1920) {
          height = (height * 1920) / width;
          width = 1920;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(blob || file);
          },
          "image/webp",
          0.8 // 80% quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a listing image to Supabase Storage
 *
 * @param file The image file to upload
 * @param listingId Optional listing ID for organization
 * @returns Upload result with public URL
 */
export async function uploadListingImage(
  file: File,
  listingId?: string
): Promise<UploadImageResult> {
  if (!ALLOWED_MIMES.includes(file.type)) {
    throw new Error("Only JPEG, PNG, and WebP images are allowed");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Image must be smaller than 5MB");
  }

  try {
    const supabase = createClient();

    // Compress the image
    const compressed = await compressImage(file);

    // Generate unique filename
    const fileName = `${uuidv4()}-${Date.now()}.webp`;
    const folder = listingId ? `listings/${listingId}` : "listings/uploads";
    const path = `${folder}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, compressed, {
        cacheControl: "3600", // 1 hour cache
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
      fileName,
    };
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to upload image");
  }
}

/**
 * Delete a listing image from Supabase Storage
 *
 * @param imagePath Storage path of the image
 */
export async function deleteListingImage(imagePath: string): Promise<void> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([imagePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to delete image");
  }
}

/**
 * Get public URL for a listing image
 *
 * @param imagePath Storage path of the image
 * @returns Public URL
 */
export function getPublicImageUrl(imagePath: string): string {
  const supabase = createClient();

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

/**
 * Delete multiple images at once
 *
 * @param imagePaths Array of storage paths
 */
export async function deleteListingImages(
  imagePaths: string[]
): Promise<void> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(imagePaths);

    if (error) {
      throw new Error(`Batch delete failed: ${error.message}`);
    }
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("Failed to delete images");
  }
}
