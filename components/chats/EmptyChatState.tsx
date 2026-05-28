import { MessageSquareOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { APP_ROUTES } from "@/constants/routes";

interface EmptyChatStateProps {
  title?: string;
  description?: string;
  showAction?: boolean;
}

export function EmptyChatState({ 
  title = "No messages yet", 
  description = "When you contact sellers or buyers message you, your conversations will appear here.",
  showAction = true
}: EmptyChatStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--cc-surface-alt)] text-[var(--cc-text-disabled)]">
        <MessageSquareOff className="h-10 w-10" />
      </div>
      <h2 className="text-xl font-bold text-[var(--cc-text-primary)] mb-2">
        {title}
      </h2>
      <p className="text-[var(--cc-text-secondary)] mb-8 max-w-sm">
        {description}
      </p>
      
      {showAction && (
        <Button href={APP_ROUTES.browse} variant="primary" size="lg">
          Browse Marketplace
        </Button>
      )}
    </div>
  );
}
