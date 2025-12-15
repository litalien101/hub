// app/(app)/admin/page.tsx // Server page: fetches admin data then renders the client UI.

import { getServerSession } from "next-auth"; // Server-side session access.
import { authOptions } from "@/lib/auth"; // NextAuth configuration.
import { prisma } from "@/lib/prisma"; // Prisma client instance.
import { redirect } from "next/navigation"; // Server redirect helper.
import AdminClient from "./admin-client"; // Client orchestrator component.

export default async function AdminPage() {
  const session = await getServerSession(authOptions); // Resolve session on the server.
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/hub"); // Only admins may view /admin.

  const tasks = await prisma.task.findMany({
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }], // Show urgent work first.
    include: {
      assignedTo: { select: { id: true, email: true } }, // Needed for cards + inspector.
      createdBy: { select: { id: true, email: true } }, // Useful for audit context.
      subtasks: true, // Inline subtasks for inspector.
      activity: {
        include: { user: { select: { email: true } } }, // Actor identity.
        orderBy: { createdAt: "desc" }, // Newest activity first.
        take: 50, // Keep payload bounded.
      },
    },
  });

  // Prisma returns Date objects; stringify to safely pass through Next.js serialization. // Serialization.
  const safe = JSON.parse(JSON.stringify(tasks)); // Convert Dates to ISO strings.

  return <AdminClient tasks={safe} />; // Render the admin kanban UI.
}
