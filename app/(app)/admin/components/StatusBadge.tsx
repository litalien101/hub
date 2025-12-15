import clsx from "clsx";
import type { TaskStatus } from "../types";

interface StatusBadgeProps {
  status: TaskStatus;
  overdue?: boolean;
  compact?: boolean;
}

const STATUS_STYLES: Record<TaskStatus, string> = {
  ASSIGNED:
    "bg-gray-100 text-gray-700 border border-gray-200",

  ACCEPTED:
    "bg-blue-100 text-blue-700 border border-blue-200",

  IN_PROGRESS:
    "bg-indigo-100 text-indigo-700 border border-indigo-200",

  BLOCKED:
    "bg-orange-100 text-orange-700 border border-orange-200",

  DONE:
    "bg-green-100 text-green-700 border border-green-200",

  DECLINED:
    "bg-red-100 text-red-700 border border-red-200",
};

export function StatusBadge({
  status,
  overdue = false,
  compact = false,
}: StatusBadgeProps) {
  return (
    <span
      role="status"
      aria-label={`Task status: ${status.replace("_", " ")}`}
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition",
        compact ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
        STATUS_STYLES[status],
        overdue &&
          status !== "DONE" &&
          status !== "DECLINED" &&
          "ring-2 ring-red-400 ring-offset-1"
      )}
    >
      {formatStatus(status)}
      {overdue && status !== "DONE" && status !== "DECLINED" && (
        <span className="ml-1 text-red-600 font-semibold">!</span>
      )}
    </span>
  );
}

/* =========================
   Helpers
========================= */
function formatStatus(status: TaskStatus) {
  return status
    .toLowerCase()
    .replace("_", " ")
    .replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}
