"use client";

import Link from "next/link";
import { Tool } from "@prisma/client";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Tooltip } from "@/ui/tooltip/Tooltip";

function iconFor(key: string) {
  switch (key) {
    case "cloud": return "☁️";
    case "book": return "📚";
    case "pen": return "🧩";
    case "layout": return "🗂️";
    case "database": return "🧠";
    case "workflow": return "🧰";
    case "bar-chart": return "📈";
    case "shield": return "🛡️";
    case "key": return "🔑";
    case "bug": return "🐞";
    case "box": return "📦";
    case "activity": return "📡";
    default: return "🔗";
  }
}

export function ToolGrid({ tools, role }: { tools: Tool[]; role: "ADMIN" | "CONTRIBUTOR" }) {
  const visible = tools.filter((t) => !(t.adminOnly && role !== "ADMIN"));

  const grouped = visible.reduce<Record<string, Tool[]>>((acc, t) => {
    acc[t.category] = acc[t.category] ?? [];
    acc[t.category].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm opacity-80 mt-1">Launch tools, track your tasks, and stay oriented.</p>
      </div>

      {Object.entries(grouped).map(([cat, items]) => (
        <section key={cat} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold opacity-90">{cat}</h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((t) => (
              <div key={t.id} className="card p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-2xl" aria-hidden>{iconFor(t.icon)}</div>
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{t.name}</div>
                      <div className="text-xs opacity-70 truncate">{t.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip content="Open in a new tab">
                      <a className="btn" href={t.url} target="_blank" rel="noreferrer" aria-label={`Open ${t.name}`}>
                        <ExternalLink size={16} />
                      </a>
                    </Tooltip>

                    <Tooltip content="Open embedded (if enabled)">
                      <Link className="btn" href={`/embed/${t.id}`} aria-label={`Embed ${t.name}`}>
                        <ArrowRight size={16} />
                      </Link>
                    </Tooltip>
                  </div>
                </div>

                <div className="text-xs opacity-70">
                  {t.adminOnly ? "Admin-only" : "Available"}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
