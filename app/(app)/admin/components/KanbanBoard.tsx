"use client"; // Client because it contains interactive UI.

import Link from "next/link"; // For navigation to create task route.
import { useMemo } from "react"; // For derived data.
import type { Task, TaskStatus } from "../types"; // Types.
import { KANBAN_COLUMNS } from "../types"; // Column order.
import KanbanColumn from "./KanbanColumn"; // Column component.

type Props = {
  tasks: Task[]; // All tasks.
  busy: boolean; // Busy flag.
  onRefresh: () => void; // Reload tasks.
  onSelect: (t: Task) => void; // Select task.
  onStatusChange: (taskId: string, next: TaskStatus) => void; // Persist status changes.
  selectedId: string | null; // Selected task id.
};

export default function KanbanBoard({ tasks, busy, onRefresh, onSelect, onStatusChange }: Props) {
  const byStatus = useMemo(() => {
    const map: Record<string, Task[]> = {}; // Status -> tasks list.
    for (const t of tasks) (map[t.status] ||= []).push(t); // Group tasks.
    return map; // Return grouped map.
  }, [tasks]);

  const total = tasks.length; // Total tasks.

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Admin Panel</div>
          <div className="text-xl font-bold text-slate-900">Task Management</div>
          <div className="mt-1 text-sm text-slate-600">{total} total tasks</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={busy}
            className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            Refresh
          </button>

          <Link
            href="/admin/tasks/new"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            + New Task
          </Link>
        </div>
      </header>

      {/* Board */}
      <div className="flex min-w-0 flex-1 gap-4 overflow-x-auto bg-slate-50 p-6">
        {KANBAN_COLUMNS.map((c) => (
          <KanbanColumn
            key={c.status}
            status={c.status}
            tasks={byStatus[c.status] ?? []}
            onSelect={onSelect}
            onDrop={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
