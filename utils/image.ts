/**
 * Image processing utilities
 */

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGES = 6;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Validates an image file against size and type constraints.
 */
export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Invalid file type. Only JPG, PNG, and WebP are allowed.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return `File too large. Maximum size is ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB.`;
  }
  return null;
}

/**
 * Future-ready abstraction for client-side image compression.
 * Currently mocked to just return the original file to prevent premature optimization blocks.
 */
export async function compressImage(file: File): Promise<File> {
  // TODO: Implement actual canvas-based or library-based (browser-image-compression) compression
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(file);
    }, 100); // simulate tiny delay
  });
}
