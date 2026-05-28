"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { ImageOff } from "lucide-react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  className?: string;
  containerClassName?: string;
  /** Show blur placeholder (pass base64 or "empty" for CSS blur) */
  blurDataURL?: string;
  /** Aspect ratio — used when fill=true */
  aspectRatio?: "square" | "video" | "portrait" | "listing";
  /** Fallback icon/element when image fails to load */
  fallback?: React.ReactNode;
  /** Object fit */
  objectFit?: "cover" | "contain" | "fill";
}

const ASPECT_RATIOS: Record<string, string> = {
  square:   "aspect-square",
  video:    "aspect-video",
  portrait: "aspect-[3/4]",
  listing:  "aspect-[4/3]",
};

/**
 * CampCart OptimizedImage — next/image wrapper with:
 * - Blur-up placeholder (blurDataURL or CSS shimmer fallback)
 * - Error fallback UI
 * - Lazy loading by default
 * - Aspect ratio container when using fill
 *
 * @example
 * <OptimizedImage src={listing.image} alt={listing.title} aspectRatio="square" fill />
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  quality = 80,
  className,
  containerClassName,
  blurDataURL,
  aspectRatio = "square",
  fallback,
  objectFit = "cover",
}: OptimizedImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (fill) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-[var(--cc-bg-muted)]",
          ASPECT_RATIOS[aspectRatio],
          containerClassName
        )}
      >
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[var(--cc-text-disabled)]">
            {fallback ?? (
              <>
                <ImageOff className="h-6 w-6" />
                <span className="text-xs">No image</span>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Shimmer until loaded */}
            {!loaded && (
              <div className="absolute inset-0 skeleton" aria-hidden />
            )}
            <Image
              src={src}
              alt={alt}
              fill
              quality={quality}
              priority={priority}
              placeholder={blurDataURL ? "blur" : "empty"}
              blurDataURL={blurDataURL}
              className={cn(
                "object-cover transition-opacity duration-300",
                loaded ? "opacity-100" : "opacity-0",
                objectFit === "contain" && "object-contain",
                objectFit === "fill" && "object-fill",
                className
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              onLoad={() => setLoaded(true)}
              onError={() => setError(true)}
            />
          </>
        )}
      </div>
    );
  }

  // Fixed-size mode
  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-[var(--cc-bg-muted)] text-[var(--cc-text-disabled)] rounded-md",
          containerClassName
        )}
        style={{ width, height }}
      >
        {fallback ?? <ImageOff className="h-5 w-5" />}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {!loaded && <div className="absolute inset-0 skeleton" aria-hidden />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
