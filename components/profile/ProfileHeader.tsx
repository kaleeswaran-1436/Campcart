import { ShieldCheck, Star, TrendingUp, Calendar, GraduationCap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";
import type { User } from "@/types/user";
import { VerificationBadge } from "@/components/ui/VerificationBadge";

interface ProfileHeaderProps {
  user: Partial<User> & {
    id: string;
    name: string;
    verification: User["verification"];
    rating: number;
    totalSales: number;
    joinedAt: string;
  };
  isOwn?: boolean;
  className?: string;
}

export function ProfileHeader({ user, isOwn = false, className }: ProfileHeaderProps) {
  return (
    <div className={cn("surface p-5 sm:p-6", className)}>
      <div className="flex flex-col sm:flex-row items-start gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={user.avatar ?? `https://i.pravatar.cc/100?u=${user.id}`}
            alt={user.name}
            className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-2 border-[var(--cc-border-subtle)]"
          />
          {user.verification === "verified" && (
            <span
              className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--cc-success)] text-white shadow-sm"
              title="Verified student"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl font-bold text-[var(--cc-text-primary)]">{user.name}</h1>
            <VerificationBadge status={user.verification} size="sm" />
            {isOwn && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--cc-primary-subtle)] text-[var(--cc-primary)]">
                You
              </span>
            )}
          </div>

          {user.college && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--cc-text-secondary)] mt-0.5">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.college}</span>
            </div>
          )}

          {user.department && (
            <p className="text-xs text-[var(--cc-text-disabled)] mt-0.5">
              {user.department}
              {user.batch ? ` · ${user.batch}` : ""}
            </p>
          )}

          {user.bio && (
            <p className="text-sm text-[var(--cc-text-secondary)] mt-3 leading-relaxed line-clamp-3">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap gap-5 mt-4 pt-4 border-t border-[var(--cc-border-subtle)]">
            {[
              {
                icon: TrendingUp,
                label: "Sales",
                value: user.totalSales ?? 0,
                color: "text-[var(--cc-success)]",
              },
              {
                icon: Star,
                label: "Rating",
                value: `${user.rating ?? "—"}★`,
                color: "text-[var(--cc-warning)]",
              },
              {
                icon: Calendar,
                label: "Joined",
                value: formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true }),
                color: "text-[var(--cc-text-secondary)]",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon className={cn("h-3.5 w-3.5", color)} />
                <div>
                  <p className={cn("text-sm font-semibold leading-none", color)}>{value}</p>
                  <p className="text-[10px] text-[var(--cc-text-disabled)] mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
