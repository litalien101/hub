import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function NewTaskPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/hub");
  }

  const users = await prisma.user.findMany({
    orderBy: { email: "asc" },
    select: { id: true, email: true },
  });

  async function createTask(formData: FormData) {
    "use server";

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        assignedToId: formData.get("assignedToId"),
        dueAt: formData.get("dueAt") || null,
        priority: formData.get("priority"),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create task");
    }

    redirect("/hub");
  }

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Create Task</h1>
        <p className="mt-1 text-sm text-gray-600">
          Assign work to a contributor and set expectations.
        </p>
      </header>

      <form action={createTask} className="space-y-6 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            required
            className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2"
            placeholder="Fix Authentik SSO redirect loop"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={4}
            className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2"
            placeholder="Optional context, links, or notes."
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Assign to</label>
          <select
            name="assignedToId"
            required
            className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.email}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Due date</label>
            <input
              type="date"
              name="dueAt"
              className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Priority</label>
            <select
              name="priority"
              className="mt-1 w-full rounded-xl border border-black/10 px-4 py-2"
            >
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <a
            href="/hub"
            className="rounded-xl border border-black/10 px-4 py-2 text-sm"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="rounded-xl bg-black px-5 py-2 text-sm font-medium text-white hover:bg-black/90"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
