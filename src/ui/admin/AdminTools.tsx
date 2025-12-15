"use client";

import type { Tool } from "@prisma/client";

export function AdminTools({ tools }: { tools: Tool[] }) {
  const ops = tools.filter((t) => t.adminOnly);
  const core = tools.filter((t) => !t.adminOnly);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Ops / Admin Tools</h2>
        <div className="space-y-2">
          {ops.map((t) => (
            <a key={t.id} className="btn w-full inline-flex justify-between" href={t.url} target="_blank" rel="noreferrer">
              <span>{t.name}</span>
              <span className="opacity-70 text-sm">open</span>
            </a>
          ))}
        </div>
      </div>

      <div className="card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Core Tools</h2>
        <div className="space-y-2">
          {core.map((t) => (
            <a key={t.id} className="btn w-full inline-flex justify-between" href={t.url} target="_blank" rel="noreferrer">
              <span>{t.name}</span>
              <span className="opacity-70 text-sm">open</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
