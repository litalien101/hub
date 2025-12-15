export default function TopBar() {
  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 className="text-2xl font-semibold">Task Management</h1>
      <a
        href="/admin/tasks/new"
        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        + New Task
      </a>
    </div>
  );
}
