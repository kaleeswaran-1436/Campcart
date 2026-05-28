import { ShieldCheck, Star, Package } from "lucide-react";
import type { ListingSeller } from "@/types/listing";

interface SellerCardProps {
  seller: ListingSeller;
}

export function SellerCard({ seller }: SellerCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--cc-border-subtle)] bg-[var(--cc-surface)] p-5">
      <h2 className="text-sm font-bold text-[var(--cc-text-primary)] uppercase tracking-wider">
        About the Seller
      </h2>
      
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--cc-surface-alt)] border border-[var(--cc-border)] text-xl font-bold text-[var(--cc-text-secondary)]">
          {seller.avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={seller.avatar} alt={seller.name} className="h-full w-full rounded-full object-cover" />
          ) : (
            seller.name.charAt(0).toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-[var(--cc-text-primary)] truncate">
              {seller.name}
            </span>
            {seller.isVerified && (
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            )}
          </div>
          <span className="text-sm text-[var(--cc-text-secondary)] truncate">
            {seller.college}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mt-2 border-t border-[var(--cc-border-subtle)] pt-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[var(--cc-text-primary)]">{seller.rating.toFixed(1)}</span>
            <span className="text-xs text-[var(--cc-text-muted)]">Rating</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
            <Package className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-[var(--cc-text-primary)]">{seller.totalSales}</span>
            <span className="text-xs text-[var(--cc-text-muted)]">Exchanges</span>
          </div>
        </div>
      </div>
    </div>
  );
}
