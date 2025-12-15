"use client"; // This file runs on the client because it uses React state + DOM drag events.

import { useEffect, useMemo, useState } from "react"; // React hooks for UI state + derived data.
import AdminSidebar from "./components/AdminSidebar"; // Collapsible admin navigation.
import KanbanBoard from "./components/KanbanBoard"; // The kanban board (Accepted/In Progress/Blocked/Done).
import TaskDetailsPanel from "./components/TaskDetailsPanel"; // Right-side inspector (subtasks + activity).
import type { Task, TaskStatus } from "./types"; // Shared task types for this admin area.

type Props = {
  tasks: Task[]; // Initial server-fetched tasks (hydration seed).
};

export default function AdminClient({ tasks }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Controls collapsible left sidebar width.
  const [items, setItems] = useState<Task[]>(tasks); // Canonical task list in this page.
  const [selectedId, setSelectedId] = useState<string | null>(null); // Currently selected task id.
  const [busy, setBusy] = useState(false); // Simple global busy flag for actions.
  const selectedTask = useMemo(
    () => items.find((t) => t.id === selectedId) ?? null,
    [items, selectedId]
  ); // Derive the selected task object from the list.

  // Keep initial tasks in sync when server data changes (rare, but good hygiene for HMR).
  useEffect(() => {
    setItems(tasks);
  }, [tasks]);

  // Refresh tasks from the API (keeps board + inspector consistent after mutations).
  async function refresh() {
    setBusy(true); // Enter busy state.
    try {
      const res = await fetch("/api/admin/tasks", { cache: "no-store" }); // Admin endpoint for all tasks.
      if (!res.ok) return; // If the request fails, keep the existing UI.
      const data = (await res.json()) as Task[]; // Parse the returned tasks.
      setItems(data); // Update the list.
    } finally {
      setBusy(false); // Leave busy state no matter what.
    }
  }

  // Optimistic status update for drag & drop and for inspector buttons.
  async function updateTaskStatus(taskId: string, next: TaskStatus) {
    // Snapshot previous list for rollback if needed.
    const prev = items;
    // Optimistically update in UI.
    setItems((cur) => cur.map((t) => (t.id === taskId ? { ...t, status: next } : t)));
    try {
      const res = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      }); // Persist status to server.
      if (!res.ok) throw new Error("Failed to update status"); // Force rollback.
      const updated = (await res.json()) as Task; // Receive updated task (with activity).
      setItems((cur) => cur.map((t) => (t.id === updated.id ? updated : t))); // Replace the updated task.
    } catch {
      setItems(prev); // Roll back UI on failure.
    }
  }

  // Selection handler (click or keyboard on a card).
  function selectTask(t: Task) {
    setSelectedId(t.id); // Open the inspector for that task.
  }

  return (
    <div className="flex h-[calc(100vh-0px)] bg-background">
      {/* Left navigation */}
      <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main work area */}
      <main className="flex flex-1 min-w-0">
        <KanbanBoard
          tasks={items}
          busy={busy}
          onRefresh={refresh}
          onSelect={selectTask}
          onStatusChange={updateTaskStatus}
          selectedId={selectedId}
        />

        {/* Right inspector */}
        <TaskDetailsPanel
          task={selectedTask}
          busy={busy}
          onStatusChange={updateTaskStatus}
          onRefresh={refresh}
        />
      </main>
    </div>
  );
}
