"use client";

import { useState, useEffect } from "react";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(d => setItems(d.notifications));
  }, []);

  return (
    <div className="relative">
      <button className="btn" onClick={() => setOpen(!open)}>🔔</button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0b0f14] p-3">
          {items.length === 0 && <div className="text-sm opacity-60">No notifications</div>}
          {items.map(n => (
            <div key={n.id} className="text-sm p-2 border-b border-white/10">
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
