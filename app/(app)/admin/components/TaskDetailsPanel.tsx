"use client"; // Client component because it uses interactive controls.

import { useMemo } from "react"; // For derived values.
import type { Task, TaskStatus } from "../types"; // Shared types.
import StatusBadge from "./StatusBadge"; // Status pill.
import SubtaskList from "./SubtaskList"; // Inline subtask panel.
import ActivityTimeline from "./ActivityTimeline"; // Activity list.

type Props = {
  task: Task | null; // Selected task (or null when none selected).
  busy: boolean; // Global busy state.
  onStatusChange: (taskId: string, next: TaskStatus) => void; // Persist status updates.
  onRefresh: () => void; // Reload tasks after mutations.
};

export default function TaskDetailsPanel({ task, busy, onStatusChange, onRefresh }: Props) {
  const isOverdue = useMemo(() => {
    if (!task?.dueAt) return false; // No due date -> not overdue.
    const due = new Date(task.dueAt).getTime(); // Due timestamp.
    return due < Date.now() && task.status !== "DONE"; // Past due and not completed.
  }, [task]);

  if (!task) {
    return (
      <aside className="hidden w-[340px] shrink-0 border-l bg-white p-4 lg:block">
        <div className="text-sm font-semibold text-slate-900">Inspector</div>
        <div className="mt-2 text-sm text-slate-500">Select a task to see details.</div>
      </aside>
    );
  }

  return (
    <aside className="hidden w-[360px] shrink-0 border-l bg-white p-4 lg:block">
      {/* Title + meta */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-slate-900">{task.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <StatusBadge status={task.status} />
            {task.priority ? (
              <span className="rounded-full border bg-slate-50 px-2 py-0.5">{task.priority}</span>
            ) : null}
            {task.dueAt ? (
              <span className={isOverdue ? "font-semibold text-red-600" : ""}>
                Due {new Date(task.dueAt).toLocaleDateString()}
              </span>
            ) : (
              <span className="text-slate-400">No due date</span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {task.description ? (
        <div className="mt-4 rounded-xl border bg-slate-50 p-3 text-sm text-slate-800">
          {task.description}
        </div>
      ) : (
        <div className="mt-4 rounded-xl border bg-slate-50 p-3 text-sm text-slate-500">
          No description.
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          disabled={busy}
          onClick={() => onStatusChange(task.id, "IN_PROGRESS")}
        >
          In Progress
        </button>
        <button
          className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50"
          disabled={busy}
          onClick={() => onStatusChange(task.id, "BLOCKED")}
        >
          Blocked
        </button>
        <button
          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
          disabled={busy}
          onClick={() => onStatusChange(task.id, "DONE")}
        >
          Done
        </button>
        <button
          className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          disabled={busy}
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>

      {/* Subtasks */}
      <div className="mt-4">
        <SubtaskList
          taskId={task.id}
          subtasks={task.subtasks ?? []}
          disabled={busy}
          onChanged={onRefresh}
        />
      </div>

      {/* Activity */}
      <div className="mt-4">
        <ActivityTimeline activity={task.activity ?? []} />
      </div>
    </aside>
  );
}
