import type { ProductCondition, ListingCategory } from "@/types/enums";
import { Badge } from "@/components/ui/Badge";
import { Clock, MapPin } from "lucide-react";

// Utility to format relative time
function getRelativeTime(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "Just now";
}

function formatCategory(category: ListingCategory) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface ListingInfoProps {
  title: string;
  price: number;
  originalPrice?: number;
  condition: ProductCondition;
  category: ListingCategory;
  department?: string;
  campus: string;
  createdAt: string;
  description: string;
}

export function ListingInfo({
  title,
  price,
  originalPrice,
  condition,
  category,
  department,
  campus,
  createdAt,
  description,
}: ListingInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--cc-text-primary)] leading-tight tracking-tight">
          {title}
        </h1>
        
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-black text-[var(--cc-text-primary)] tracking-tight">
            ₹{price}
          </span>
          {originalPrice && (
            <span className="text-lg text-[var(--cc-text-disabled)] line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <Badge variant="default" className="text-[var(--cc-text-secondary)] border-[var(--cc-border)] font-medium">
            {formatCategory(category)}
          </Badge>
          <Badge variant="default" className="capitalize border-[var(--cc-border)] font-medium">
            {condition.replace("-", " ")}
          </Badge>
          {department && (
            <Badge variant="default" className="border-[var(--cc-border)] font-medium">
              {department}
            </Badge>
          )}
        </div>
      </div>

      {/* Meta details */}
      <div className="flex items-center gap-4 text-sm text-[var(--cc-text-secondary)]">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>Listed {getRelativeTime(createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>{campus}</span>
        </div>
      </div>

      <hr className="border-[var(--cc-border-subtle)]" />

      {/* Description */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold text-[var(--cc-text-primary)]">Description</h2>
        <div className="text-[var(--cc-text-secondary)] leading-relaxed whitespace-pre-wrap text-[15px]">
          {description}
        </div>
      </div>
    </div>
  );
}
