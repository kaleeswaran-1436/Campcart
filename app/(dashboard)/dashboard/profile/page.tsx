"use client";

import { useState } from "react";
import {
  User, Mail, Phone, BookOpen, GraduationCap,
  Save, ShieldCheck, Star, TrendingUp, Camera,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VerificationBadge } from "@/components/ui/VerificationBadge";
import { Badge } from "@/components/ui/Badge";
import { MOCK_CURRENT_USER } from "@/lib/mock/user";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { APP_ROUTES } from "@/constants/routes";

export default function DashboardProfilePage() {
  const user = MOCK_CURRENT_USER;
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[var(--cc-text-primary)]">My Profile</h1>
        <p className="text-sm text-[var(--cc-text-secondary)] mt-0.5">
          Manage how other students see you on CampCart
        </p>
      </div>

      {/* Avatar + basic info */}
      <div className="surface p-5 flex flex-col sm:flex-row items-start gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-20 w-20 rounded-2xl object-cover border-2 border-[var(--cc-border-subtle)]"
          />
          <button
            type="button"
            className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--cc-primary)] text-white shadow-md hover:bg-[var(--cc-primary-hover)] transition-colors"
            title="Change photo"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Name + verification */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="text-lg font-bold text-[var(--cc-text-primary)]">{user.name}</h2>
            <VerificationBadge status={user.verification} size="sm" />
          </div>
          <p className="text-sm text-[var(--cc-text-secondary)]">{user.college}</p>
          <p className="text-xs text-[var(--cc-text-disabled)] mt-0.5">
            {user.department} · {user.batch}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 mt-3">
            {[
              { icon: TrendingUp, value: `${user.totalSales} sold`,       color: "text-[var(--cc-success)]"  },
              { icon: Star,       value: `${user.rating}★ rating`,         color: "text-[var(--cc-warning)]"  },
              { icon: ShieldCheck, value: user.verification === "verified" ? "Verified" : "Pending", color: user.verification === "verified" ? "text-[var(--cc-success)]" : "text-[var(--cc-warning)]" },
            ].map(({ icon: Icon, value, color }) => (
              <div key={value} className="flex items-center gap-1.5">
                <Icon className={cn("h-3.5 w-3.5", color)} />
                <span className="text-xs font-medium text-[var(--cc-text-secondary)]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification status */}
      {user.verification === "verified" ? (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--cc-success-subtle)] border border-[var(--cc-success-border)]">
          <ShieldCheck className="h-5 w-5 text-[var(--cc-success)] shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--cc-success-fg)]">
              Student ID Verified ✓
            </p>
            <p className="text-xs text-[var(--cc-success-fg)]/70 mt-0.5">
              Your student ID has been verified. Buyers see a verified badge on your listings.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--cc-warning-subtle)] border border-[var(--cc-warning-border)]">
          <ShieldCheck className="h-5 w-5 text-[var(--cc-warning)] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--cc-warning-fg)]">
              Verification Pending
            </p>
            <p className="text-xs text-[var(--cc-warning-fg)]/80 mt-0.5 mb-2">
              Upload your student ID to get verified and unlock full marketplace access.
            </p>
            <Button href={APP_ROUTES.verify} variant="primary" size="sm" className="gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Complete Verification
            </Button>
          </div>
        </div>
      )}

      {/* Editable fields */}
      <div className="surface p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--cc-text-primary)]">
          Edit Information
        </h3>

        <FieldGroup label="Full Name" icon={User}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field-input"
            placeholder="Your name"
          />
        </FieldGroup>

        <FieldGroup label="College Email" icon={Mail}>
          <input
            type="email"
            value={user.email}
            disabled
            className="field-input opacity-60 cursor-not-allowed"
          />
          <p className="text-xs text-[var(--cc-text-disabled)] mt-1">
            Email cannot be changed (used for verification)
          </p>
        </FieldGroup>

        <FieldGroup label="Mobile Number" icon={Phone}>
          <input
            type="tel"
            defaultValue={user.phone}
            className="field-input"
            placeholder="+91 XXXXXXXXXX"
          />
        </FieldGroup>

        <FieldGroup label="Bio" icon={BookOpen}>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={200}
            className="field-input resize-none"
            placeholder="Tell buyers a bit about yourself…"
          />
          <p className="text-xs text-[var(--cc-text-disabled)] mt-1 text-right">
            {bio.length}/200
          </p>
        </FieldGroup>

        {/* Read-only academic */}
        <div className="pt-2 border-t border-[var(--cc-border-subtle)]">
          <p className="text-xs font-semibold text-[var(--cc-text-secondary)] uppercase tracking-wide mb-3">
            Academic Details
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Roll Number",    value: user.rollNumber ?? "—" },
              { label: "Department",     value: user.department ?? "—" },
              { label: "Batch",          value: user.batch ?? "—"      },
              { label: "College",        value: user.college            },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-[var(--cc-text-disabled)] uppercase tracking-wide">{label}</p>
                <p className="text-sm font-medium text-[var(--cc-text-primary)] mt-0.5 truncate">{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--cc-text-disabled)] mt-3">
            Academic details are locked after verification. Contact support to update.
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            loading={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Small field wrapper ─────────────────────────────────────── */
function FieldGroup({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-[var(--cc-text-primary)]">
        <Icon className="h-3.5 w-3.5 text-[var(--cc-text-secondary)]" />
        {label}
      </label>
      {children}
    </div>
  );
}
