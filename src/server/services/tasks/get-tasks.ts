import { prisma } from "@/lib/db/prisma";

export async function listTasks(userId: string, dayKey?: string | null) {
  return prisma.task.findMany({
    where: { userId, ...(dayKey ? { dayKey } : {}) },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });
}
