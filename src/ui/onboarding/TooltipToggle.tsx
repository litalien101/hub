"use client";

import { useUserPrefs } from "@/ui/onboarding/useUserPrefs";
import { HelpCircle } from "lucide-react";

export function TooltipToggle() {
  const { prefs, setPrefs } = useUserPrefs();

  async function persist(next: boolean) {
    await fetch("/api/me/preferences", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tooltipEnabled: next })
    });
  }

  const enabled = prefs?.tooltipEnabled ?? true;

  return (
    <button
      className="btn"
      type="button"
      onClick={async () => {
        const next = !enabled;
        setPrefs({ ...(prefs ?? { tourDismissed: false, tooltipEnabled: true }), tooltipEnabled: next });
        await persist(next);
      }}
      aria-label={enabled ? "Disable tooltips" : "Enable tooltips"}
      title={enabled ? "Disable tooltips" : "Enable tooltips"}
    >
      <HelpCircle size={18} />
    </button>
  );
}
