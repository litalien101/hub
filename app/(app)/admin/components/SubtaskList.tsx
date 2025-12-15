"use client"; // Client component because it performs fetch calls + uses local state.

import { useMemo, useState } from "react"; // React hooks for UI state and derived values.
import type { SubTask } from "../types"; // Shared subtask type.

type Props = {
  taskId: string; // Parent task id for create endpoint.
  subtasks: SubTask[]; // Current subtasks for rendering.
  onChanged: () => void; // Caller-provided refresh hook.
  disabled?: boolean; // Optional UI disable state.
};

export default function SubtaskList({ taskId, subtasks, onChanged, disabled }: Props) {
  const [title, setTitle] = useState(""); // New subtask title input.
  const [saving, setSaving] = useState(false); // Local saving flag for subtask operations.

  const doneCount = useMemo(
    () => subtasks.filter((s) => s.done).length,
    [subtasks]
  ); // Compute completion count for header.

  async function addSubtask() {
    const trimmed = title.trim(); // Avoid empty titles.
    if (!trimmed) return; // No-op for empty input.
    setSaving(true); // Disable UI while saving.
    try {
      const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: trimmed }),
      }); // Create the subtask (assignee or admin allowed).
      if (!res.ok) return; // Silently ignore for now (could show toast).
      setTitle(""); // Clear the input.
      onChanged(); // Refresh parent task data.
    } finally {
      setSaving(false); // Re-enable UI.
    }
  }

  async function toggleDone(subtaskId: string, nextDone: boolean) {
    setSaving(true); // Disable UI while saving.
    try {
      const res = await fetch(`/api/subtasks/${subtaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: nextDone }),
      }); // Toggle done.
      if (!res.ok) return; // Keep UI as-is if it fails.
      onChanged(); // Refresh data.
    } finally {
      setSaving(false); // Re-enable UI.
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">Subtasks</div>
          <div className="text-xs text-slate-500">
            {doneCount}/{subtasks.length} complete
          </div>
        </div>
      </div>

      {/* Add row */}
      <div className="mt-3 flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a subtask…"
          className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          disabled={disabled || saving}
        />
        <button
          onClick={addSubtask}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
          disabled={disabled || saving || !title.trim()}
        >
          Add
        </button>
      </div>

      {/* List */}
      <div className="mt-3 space-y-2">
        {subtasks.length === 0 ? (
          <div className="text-sm text-slate-500">No subtasks yet.</div>
        ) : (
          subtasks.map((s) => (
            <label
              key={s.id}
              className="flex items-center gap-3 rounded-lg border bg-slate-50 px-3 py-2 text-sm hover:bg-slate-100"
            >
              <input
                type="checkbox"
                checked={s.done}
                onChange={(e) => toggleDone(s.id, e.target.checked)}
                disabled={disabled || saving}
              />
              <span className={s.done ? "line-through text-slate-500" : "text-slate-900"}>
                {s.title}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
