"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Prefs = { tooltipEnabled: boolean; tourDismissed: boolean } | null;

const Ctx = createContext<{
  prefs: Prefs;
  setPrefs: (p: Prefs) => void;
  refresh: () => Promise<void>;
} | null>(null);

export function UserPrefsProvider({ initial, children }: { initial: Prefs; children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(initial);

  async function refresh() {
    // no-op for now; preferences are refreshed on page navigation via server
  }

  const value = useMemo(() => ({ prefs, setPrefs, refresh }), [prefs]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUserPrefs() {
  const v = useContext(Ctx);
  if (!v) {
    // fallback: tooltips on by default
    return { prefs: { tooltipEnabled: true, tourDismissed: false }, setPrefs: () => {}, refresh: async () => {} };
  }
  return v;
}
