"use client"; // Client because it reacts to drag events.

import { useMemo, useState } from "react"; // Hooks for derived counts and drag-over UI.
import KanbanCard from "./KanbanCard"; // Task cards.
import type { Task, TaskStatus } from "../types"; // Types.

type Props = {
  status: TaskStatus; // Column status.
  tasks: Task[]; // Tasks in this column.
  onSelect: (t: Task) => void; // Select a task (opens inspector).
  onDrop: (taskId: string, next: TaskStatus) => void; // Persist move (drag & drop).
};

function titleFor(status: TaskStatus) {
  // Human labels for statuses. // Mapping.
  switch (status) {
    case "ACCEPTED":
      return "Accepted";
    case "IN_PROGRESS":
      return "In Progress";
    case "BLOCKED":
      return "Blocked";
    case "DONE":
      return "Done";
    default:
      return status;
  }
}

export default function KanbanColumn({ status, tasks, onSelect, onDrop }: Props) {
  const [isOver, setIsOver] = useState(false); // Visual highlight when dragging over.
  const count = useMemo(() => tasks.length, [tasks]); // Count badge.

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault(); // Required to allow dropping.
    setIsOver(true); // Turn on highlight.
  }

  function handleDragLeave() {
    setIsOver(false); // Turn off highlight.
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); // Prevent browser navigation.
    setIsOver(false); // Turn off highlight.
    const taskId = e.dataTransfer.getData("text/task-id"); // Read id from card.
    if (!taskId) return; // Nothing to do.
    onDrop(taskId, status); // Request status change.
  }

  return (
    <section
      className={[
        "w-[320px] shrink-0 rounded-2xl border bg-white p-3 shadow-sm",
        isOver ? "ring-2 ring-blue-200" : "",
      ].join(" ")}
      aria-label={titleFor(status)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">{titleFor(status)}</div>
        <div className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
          {count}
        </div>
      </div>

      {/* Column body */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-slate-50 px-3 py-6 text-center text-xs text-slate-500">
            Drop tasks here
          </div>
        ) : (
          tasks.map((t) => (
            <KanbanCard key={t.id} task={t} onSelect={onSelect} />
          ))
        )}
      </div>
    </section>
  );
}
