/**
 * Generate a URL-friendly slug from a string
 * Example: "iPhone 14 Pro Max" -> "iphone-14-pro-max"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Create a unique slug by appending a random suffix if needed
 */
export function generateUniqueSlug(baseSlug: string, id: string): string {
  // Use format: base-slug-xxx where xxx is first 8 chars of ID
  const suffix = id.replace(/-/g, '').substring(0, 8);
  return `${baseSlug}-${suffix}`.toLowerCase();
}
