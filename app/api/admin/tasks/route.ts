import { NextResponse } from "next/server"; // Next.js response helper.
import { getServerSession } from "next-auth"; // Session check.
import { authOptions } from "@/lib/auth"; // NextAuth config.
import { prisma } from "@/lib/prisma"; // Prisma client.

export async function GET() {
  const session = await getServerSession(authOptions); // Identify the current user.
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // Require login.
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 }); // Admin-only.

  const tasks = await prisma.task.findMany({
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }], // Overdue/soonest first.
    include: {
      assignedTo: { select: { id: true, email: true } }, // Assignee identity.
      createdBy: { select: { id: true, email: true } }, // Creator identity.
      subtasks: true, // Inline subtasks for inspector panel.
      activity: { include: { user: { select: { email: true } } }, orderBy: { createdAt: "desc" }, take: 50 }, // Timeline.
    },
  });

  return NextResponse.json(tasks); // Return canonical payload.
}
