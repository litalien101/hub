export const TASK_STATUSES = ["ASSIGNED", "ACCEPTED", "IN_PROGRESS", "BLOCKED", "DONE"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ["LOW", "NORMAL", "HIGH", "URGENT"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export function isValidStatus(v: any): v is TaskStatus {
  return TASK_STATUSES.includes(v);
}
export function isValidPriority(v: any): v is TaskPriority {
  return TASK_PRIORITIES.includes(v);
}

export function isOverdue(dueAt: Date | null | undefined) {
  if (!dueAt) return false;
  const now = new Date();
  return dueAt.getTime() < now.getTime();
}

export function isToday(dueAt: Date | null | undefined) {
  if (!dueAt) return false;
  const d = new Date(dueAt);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}

export function daysLate(dueAt: Date) {
  const ms = Date.now() - dueAt.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}