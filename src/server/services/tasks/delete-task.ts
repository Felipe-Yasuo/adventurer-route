import { prisma } from "@/lib/prisma";

export type DeleteTaskResult =
  | { ok: true }
  | { ok: false; status: 404; error: string };

export async function deleteTask(
  userId: string,
  taskId: string
): Promise<DeleteTaskResult> {
  const deleted = await prisma.task.deleteMany({
    where: { id: taskId, userId },
  });

  if (deleted.count === 0) {
    return { ok: false, status: 404, error: "Task não encontrada" };
  }

  return { ok: true };
}
