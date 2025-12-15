"use client";

import { useState } from "react";
import type { User } from "@prisma/client";
import { useUserPrefs } from "@/ui/onboarding/useUserPrefs";
import { X, Sparkles } from "lucide-react";

type Step = { title: string; body: string };

const STEPS: Step[] = [
  { title: "Welcome", body: "This hub is your launchpad. Open tools, track tasks, and keep your workflow clean." },
  { title: "Tooltips", body: "Hover on buttons for quick guidance. You can toggle tooltips anytime in the top bar." },
  { title: "Embeds", body: "Embeds are off by default for safety. Enable ALLOW_IFRAME_EMBEDS in .env when ready." }
];

export function Onboarding({ user }: { user: User | null }) {
  const { prefs, setPrefs } = useUserPrefs();
  const dismissed = prefs?.tourDismissed ?? false;
  const [step, setStep] = useState(0);

  async function dismiss() {
    setPrefs({ ...(prefs ?? { tooltipEnabled: true, tourDismissed: false }), tourDismissed: true });
    await fetch("/api/me/preferences", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ tourDismissed: true })
    });
  }

  if (dismissed) return null;

  const s = STEPS[Math.min(step, STEPS.length - 1)];

  return (
    <div className="card p-5 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <div>
            <div className="text-sm font-semibold">{s.title}</div>
            <div className="text-xs opacity-70 mt-1">{s.body}</div>
          </div>
        </div>

        <button className="btn" onClick={dismiss} aria-label="Dismiss tour" title="Dismiss">
          <X size={16} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs opacity-60">
          Step {step + 1} / {STEPS.length}
        </div>
        <div className="flex gap-2">
          <button className="btn" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
              Next
            </button>
          ) : (
            <button className="btn btn-primary" onClick={dismiss}>
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
