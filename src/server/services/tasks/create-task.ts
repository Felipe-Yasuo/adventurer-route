import { prisma } from "@/lib/prisma";
import { todayKey } from "@/lib/game/time";
import type { Difficulty, TaskApi } from "@/features/tasks/types";

const TZ = "America/Sao_Paulo";

function todayNoon() {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d;
}

export type CreateTaskInput = {
  title: string;
  difficulty?: Difficulty;
  dueDate?: string | null;
  dayKey?: string;
};

export type CreateTaskResult =
  | { ok: true; task: TaskApi }
  | { ok: false; status: 400; error: string };

export async function createTask(
  userId: string,
  input: CreateTaskInput
): Promise<CreateTaskResult> {
  const { title, difficulty, dueDate, dayKey } = input;
  const resolvedDayKey = (dayKey ?? todayKey(TZ)).trim();

  const resolvedDueDate =
    dueDate && dueDate.trim().length > 0 ? new Date(dueDate) : todayNoon();

  if (Number.isNaN(resolvedDueDate.getTime())) {
    return { ok: false, status: 400, error: "dueDate inválida" };
  }

  const task = await prisma.task.create({
    data: {
      title,
      difficulty: difficulty ?? "EASY",
      dueDate: resolvedDueDate,
      userId,
      dayKey: resolvedDayKey,
    },
  });

  return { ok: true, task: task as unknown as TaskApi };
}
