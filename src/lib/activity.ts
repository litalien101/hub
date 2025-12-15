import { prisma } from "@/lib/prisma";

export async function logTaskActivity({
  taskId,
  userId,
  action,
  metadata = ""
}: {
  taskId: string;
  userId: string;
  action: string;
  metadata?: string;
}) {
  await (prisma as any).taskActivity.create({
    data: { taskId, userId, action, metadata }
  });
}
