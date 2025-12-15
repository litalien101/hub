// app/(app)/admin/types.ts // Shared types for admin task UI (kept local to /admin for clarity).

// Roles used by the hub (stored as string in the DB). // Role values.
export type Role = "ADMIN" | "CONTRIBUTOR"; // Supported user roles.

// Basic user shape used by admin UI. // User interface.
export interface User {
  id: string; // User id (cuid).
  email: string; // Email address (unique).
  role: Role; // Role string.
}

// Task status values (must match your Prisma default/status usage). // Task statuses.
export type TaskStatus = "ASSIGNED" | "ACCEPTED" | "IN_PROGRESS" | "BLOCKED" | "DONE" | "DECLINED"; // Allowed statuses.

// Task priority values (stored as string in DB). // Priorities.
export type TaskPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT"; // Allowed priorities.

// Subtask entity used in inspector + cards. // Subtask interface.
export interface SubTask {
  id: string; // Subtask id (cuid).
  title: string; // Subtask title.
  done: boolean; // Completion flag.
  taskId: string; // Parent task id.
  createdAt: string; // ISO date string.
  updatedAt: string; // ISO date string.
}

// Activity entries for the timeline. // TaskActivity interface.
export interface TaskActivity {
  id: string; // Activity id (cuid).
  taskId: string; // Parent task id.
  action: string; // Action name (e.g. STATUS_CHANGED).
  metadata: string; // JSON string with extra info.
  createdAt: string; // ISO date string.
  user?: { email: string } | null; // Actor identity (included by API).
}

// Task entity shape for admin kanban. // Task interface.
export interface Task {
  id: string; // Task id (cuid).
  title: string; // Task title.
  description: string; // Task description/context.
  status: TaskStatus; // Current status.
  priority: TaskPriority; // Current priority.
  dueAt: string | null; // Due date/time (ISO) or null.
  acceptedAt: string | null; // When assignee accepted, if any.
  declinedAt: string | null; // When assignee declined, if any.
  declineReason: string; // Optional decline reason.
  createdAt: string; // Created timestamp (ISO).
  updatedAt: string; // Updated timestamp (ISO).

  assignedToId: string; // Assignee id.
  assignedTo?: { id: string; email: string } | null; // Assignee identity.

  createdById: string; // Creator id.
  createdBy?: { id?: string; email: string } | null; // Creator identity.

  subtasks?: SubTask[]; // Included subtasks.
  activity?: TaskActivity[]; // Included activity timeline.
}

// Kanban column configuration. // Column shape.
export interface KanbanColumn {
  status: TaskStatus; // Status represented by column.
  title: string; // UI label.
}

// Column order for board rendering. // Default column list.
export const KANBAN_COLUMNS: KanbanColumn[] = [
  { status: "ACCEPTED", title: "Accepted" }, // Accepted tasks.
  { status: "IN_PROGRESS", title: "In Progress" }, // Being worked.
  { status: "BLOCKED", title: "Blocked" }, // Blocked.
  { status: "DONE", title: "Done" }, // Completed.
];
