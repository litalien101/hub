"use client";

import type { User } from "@prisma/client";
import { UserPrefsProvider } from "@/ui/onboarding/useUserPrefs";

export function UserPrefsHydrator({ user, children }: { user: Pick<User, "tooltipEnabled" | "tourDismissed">; children: React.ReactNode }) {
  return <UserPrefsProvider initial={{ tooltipEnabled: user.tooltipEnabled, tourDismissed: user.tourDismissed }}>{children}</UserPrefsProvider>;
}
