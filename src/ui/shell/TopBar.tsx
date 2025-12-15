"use client";
import { ModeToggle } from "@/ui/ModeToggle";
import { RoleBadge } from "@/ui/RoleBadge";
import { TooltipToggle } from "@/ui/onboarding/TooltipToggle";

export function TopBar({ email, role }: { email: string; role: "ADMIN" | "CONTRIBUTOR" }) {
  return (
    <div className="card p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">{email}</div>
          <div className="text-xs opacity-70">Signed in</div>
        </div>
        <RoleBadge role={role} />
      </div>

      <div className="flex items-center gap-2">
        <TooltipToggle />
        <ModeToggle />
      </div>
    </div>
  );
}
