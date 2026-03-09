import { prisma } from "@/lib/db/prisma";
import type { Difficulty, TaskApi } from "@/features/tasks/types";

export type UpdateTaskInput = {
  title?: string;
  difficulty?: Difficulty;
  dueDate?: string | null;
  completed?: boolean;
};

export type UpdateTaskResult =
  | { ok: true; task: TaskApi }
  | { ok: false; status: 400 | 404; error: string };

export async function updateTask(
  userId: string,
  taskId: string,
  input: UpdateTaskInput
): Promise<UpdateTaskResult> {
  const data: Record<string, unknown> = {};

  if (typeof input.title === "string") data.title = input.title;
  if (input.difficulty) data.difficulty = input.difficulty;

  if ("dueDate" in input) {
    if (input.dueDate) {
      const parsedDate = new Date(input.dueDate);
      if (Number.isNaN(parsedDate.getTime())) {
        return { ok: false, status: 400, error: "dueDate inválida" };
      }
      data.dueDate = parsedDate;
    } else {
      data.dueDate = null;
    }
  }

  if (typeof input.completed === "boolean") {
    data.completed = input.completed;
    data.completedAt = input.completed ? new Date() : null;
  }

  const updated = await prisma.task.updateMany({
    where: { id: taskId, userId },
    data,
  });

  if (updated.count === 0) {
    return { ok: false, status: 404, error: "Task não encontrada" };
  }

  const fresh = await prisma.task.findUnique({ where: { id: taskId } });
  if (!fresh) return { ok: false, status: 404, error: "Task não encontrada" };

  return { ok: true, task: fresh as unknown as TaskApi };
}
