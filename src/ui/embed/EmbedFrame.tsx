"use client";

import { useMemo } from "react";

export function EmbedFrame({ title, url }: { title: string; url: string }) {
  const safe = useMemo(() => {
    try {
      const u = new URL(url);
      return u.toString();
    } catch {
      return "";
    }
  }, [url]);

  if (!safe) {
    return (
      <div className="card p-5">
        <h1 className="text-xl font-semibold">Invalid URL</h1>
        <p className="text-sm opacity-80 mt-2">This tool does not have a valid embed URL.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-sm font-semibold">{title}</h1>
        <p className="text-xs opacity-70 mt-1">Embedded view (dev). Some apps may block iframes via headers.</p>
      </div>
      <iframe
        title={title}
        src={safe}
        className="w-full"
        style={{ height: "78vh" }}
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
