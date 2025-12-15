"use client";

import { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
  actions
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b0f14] p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="btn">✕</button>
        </div>

        <div className="mt-4">{children}</div>

        {actions && (
          <div className="mt-5 flex justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
