import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/routes";

export default function ListingNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--cc-surface-alt)] text-[var(--cc-text-disabled)]">
        <PackageX className="h-10 w-10" />
      </div>
      <h1 className="text-2xl font-bold text-[var(--cc-text-primary)] mb-2">
        Listing Not Found
      </h1>
      <p className="text-[var(--cc-text-secondary)] mb-8 max-w-md">
        This item may have been removed, sold, or the link might be broken.
      </p>
      <Button href={APP_ROUTES.browse} variant="primary" size="lg">
        Return to Marketplace
      </Button>
    </div>
  );
}
