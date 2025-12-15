"use client"; // Client for drag + click handlers.

import type { Task } from "../types"; // Task type.
import StatusBadge from "./StatusBadge"; // Status pill.

type Props = {
  task: Task; // Task to render.
  onSelect: (t: Task) => void; // Select handler.
};

export default function KanbanCard({ task, onSelect }: Props) {
  const dueMs = task.dueAt ? new Date(task.dueAt).getTime() : null; // Due date as ms.
  const isOverdue = dueMs !== null && dueMs < Date.now() && task.status !== "DONE"; // Overdue flag.

  function onDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("text/task-id", task.id); // Store the task id for drop target.
    e.dataTransfer.effectAllowed = "move"; // Hint that this is a move.
  }

  function open() {
    onSelect(task); // Open inspector.
  }

  return (
    <div
      className={[
        "group cursor-pointer rounded-xl border bg-white p-3 shadow-sm hover:shadow-md",
        isOverdue ? "border-red-200" : "border-slate-200",
      ].join(" ")}
      role="button"
      tabIndex={0}
      draggable
      onDragStart={onDragStart}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      aria-label={`Open task ${task.title}`}
    >
      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">{task.title}</div>
          <div className="mt-1 text-xs text-slate-500">
            {task.assignedTo?.email ?? "Unassigned"}
          </div>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Footer: due / priority */}
      <div className="mt-3 flex items-center justify-between">
        <div className={["text-xs", isOverdue ? "font-semibold text-red-600" : "text-slate-500"].join(" ")}>
          {task.dueAt ? `Due ${new Date(task.dueAt).toLocaleDateString()}` : "No due date"}
        </div>
        <div className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
          {task.priority ?? "NORMAL"}
        </div>
      </div>
    </div>
  );
}
