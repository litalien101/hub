"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useUserPrefs } from "@/ui/onboarding/useUserPrefs";

export function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const { prefs } = useUserPrefs();
  const enabled = prefs?.tooltipEnabled ?? true;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <div
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open ? (
        <div className={cn("absolute z-50 top-full mt-2 w-max max-w-[240px] px-3 py-2 rounded-xl border text-xs", "bg-black/70 backdrop-blur border-white/15")}>
          {content}
        </div>
      ) : null}
    </div>
  );
}
