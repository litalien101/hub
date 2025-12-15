"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

type Task = any;

export default function HubClient({
  user,
  isAdmin,
  tasks,
}: {
  user: any;
  isAdmin: boolean;
  tasks: Task[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<
    "ALL" | "ACTIVE" | "OVERDUE" | "BLOCKED"
  >("ALL");

  const now = new Date();

  const filtered = tasks.filter((t) => {
    if (filter === "OVERDUE")
      return t.dueAt && new Date(t.dueAt) < now && t.status !== "DONE";
    if (filter === "BLOCKED") return t.status === "BLOCKED";
    if (filter === "ACTIVE")
      return ["ASSIGNED", "ACCEPTED", "IN_PROGRESS"].includes(t.status);
    return true;
  });

  return (
    <div className="flex h-full min-h-screen">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } flex flex-col bg-[#1f2937] text-gray-200 transition-all duration-300`}
      >
        {/* APP HEADER */}
        <div className="flex items-center justify-between px-4 py-4">
          {sidebarOpen && (
            <div className="text-sm font-semibold tracking-wide">
              Guardian Hub
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            ☰
          </button>
        </div>

        {/* MAIN NAV */}
        <nav className="space-y-1 px-2 text-sm">
          <SidebarLink label="Dashboard" />
          {isAdmin && <SidebarLink label="Admin Console" href="/admin" />}
          <SidebarLink label="Status" href="/status" />
        </nav>

        <div className="my-4 border-t border-white/10" />

        {/* TASK FILTERS */}
        <nav className="space-y-1 px-2 text-sm">
          <FilterButton label="All Tasks" value="ALL" />
          <FilterButton label="Assigned to Me" value="ACTIVE" />
          <FilterButton label="Overdue" value="OVERDUE" />
          <FilterButton label="Blocked" value="BLOCKED" />
        </nav>

        {/* USER FOOTER */}
        <div className="mt-auto border-t border-white/10 p-3 text-xs">
          {sidebarOpen && (
            <>
              <div className="truncate font-medium">{user.email}</div>
              <div className="mt-0.5 text-gray-400">{user.role}</div>
            </>
          )}

          <button
            onClick={() => signOut()}
            className="mt-3 w-full rounded-md bg-white/10 px-3 py-2 text-left text-xs hover:bg-white/20"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 overflow-y-auto bg-[#f6f7f9] p-6">
        {/* COMMAND HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My Work</h1>
            <p className="text-sm text-gray-600">
              {filtered.length} task{filtered.length !== 1 && "s"}
            </p>
          </div>

          {isAdmin && (
            <a
              href="/admin/tasks/new"
              className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white"
            >
              + New Task
            </a>
          )}
        </div>

        {/* METRICS */}
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="All Tasks" value={tasks.length} />
          <Metric
            label="Incomplete"
            value={tasks.filter((t) => t.status !== "DONE").length}
          />
          <Metric
            label="Overdue"
            value={tasks.filter(
              (t) =>
                t.dueAt &&
                new Date(t.dueAt) < new Date() &&
                t.status !== "DONE"
            ).length}
            accent="red"
          />
          <Metric
            label="Due Today"
            value={tasks.filter((t) => {
              if (!t.dueAt) return false;
              const d = new Date(t.dueAt);
              const n = new Date();
              return (
                d.getFullYear() === n.getFullYear() &&
                d.getMonth() === n.getMonth() &&
                d.getDate() === n.getDate()
              );
            }).length}
            accent="orange"
          />
        </div>

        {/* TASK TABLE */}
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Nothing here.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Task</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due</th>
                  <th>Progress</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((task) => {
                  const done = task.subtasks.filter((s: any) => s.done).length;
                  const total = task.subtasks.length;

                  return (
                    <tr
                      key={task.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {task.title}
                        <div className="text-xs text-gray-500">
                          Assigned by {task.createdBy.email}
                        </div>
                      </td>
                      <td>
                        <PriorityPill value={task.priority} />
                      </td>
                      <td>
                        <StatusPill value={task.status} />
                      </td>
                      <td className="text-gray-600">
                        {task.dueAt
                          ? new Date(task.dueAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td>{total > 0 ? `${done}/${total}` : "—"}</td>
                      <td className="pr-4 text-right">
                        <button
                          onClick={() => setActiveTask(task)}
                          className="text-blue-600 hover:underline"
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* ================= TASK DETAIL PANEL ================= */}
      {activeTask && (
        <aside className="w-96 border-l bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{activeTask.title}</h2>
            <button
              onClick={() => setActiveTask(null)}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6 text-sm">
            <div>
              <div className="font-medium">Description</div>
              <div className="text-gray-600">
                {activeTask.description || "—"}
              </div>
            </div>

            <div>
              <div className="font-medium">Subtasks</div>
              {activeTask.subtasks.map((s: any) => (
                <div key={s.id} className="flex items-center gap-2">
                  <input type="checkbox" checked={s.done} readOnly />
                  <span>{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );

  /* ================= HELPERS ================= */

  function SidebarLink({
    label,
    href = "/hub",
  }: {
    label: string;
    href?: string;
  }) {
    return (
      <a
        href={href}
        className="block rounded-md px-3 py-2 hover:bg-white/10"
      >
        {sidebarOpen && label}
      </a>
    );
  }

  function FilterButton({
    label,
    value,
  }: {
    label: string;
    value: any;
  }) {
    return (
      <button
        onClick={() => setFilter(value)}
        className={`block w-full rounded-md px-3 py-2 text-left ${
          filter === value
            ? "bg-blue-600 text-white"
            : "hover:bg-white/10"
        }`}
      >
        {sidebarOpen && label}
      </button>
    );
  }
}

/* ================= UI COMPONENTS ================= */

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "red" | "orange";
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="text-xs text-gray-500">{label}</div>
      <div
        className={`mt-1 text-2xl font-semibold ${
          accent === "red"
            ? "text-red-600"
            : accent === "orange"
            ? "text-orange-600"
            : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  const map: any = {
    ASSIGNED: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    BLOCKED: "bg-orange-100 text-orange-700",
    DONE: "bg-green-100 text-green-700",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs ${map[value]}`}>
      {value.replace("_", " ")}
    </span>
  );
}

function PriorityPill({ value }: { value: string }) {
  const map: any = {
    URGENT: "bg-red-100 text-red-700",
    HIGH: "bg-orange-100 text-orange-700",
    NORMAL: "bg-gray-100 text-gray-700",
    LOW: "bg-gray-50 text-gray-500",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs ${map[value]}`}>
      {value}
    </span>
  );
}
