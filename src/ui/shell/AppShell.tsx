import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {children}
    </div>
  );
}
