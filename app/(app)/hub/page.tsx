import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import HubClient from "./hub-client";

export default async function HubPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";

  const tasks = await prisma.task.findMany({
    where: { assignedToId: session.user.id },
    orderBy: [{ dueAt: "asc" }, { createdAt: "desc" }],
    include: {
      subtasks: true,
      createdBy: { select: { email: true } },
    },
  });

  return (
    <HubClient
      user={session.user}
      isAdmin={isAdmin}
      tasks={tasks}
    />
  );
}
