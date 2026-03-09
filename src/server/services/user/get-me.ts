import { prisma } from "@/lib/prisma";
import { applyOverduePenalty } from "@/server/game/penalties/overdue";
import { applyInactivityPenalty } from "@/server/game/penalties/inactivity";
import { startOfWeekKey } from "@/server/game/time/time";

const TZ = "America/Sao_Paulo";

export type GetMeResult =
  | {
      ok: true;
      id: string;
      name: string | null;
      email: string | null;
      level: number;
      xp: number;
      life: number;
      maxLife: number;
      gold: number;
      streakCount: number;
      lastCompletionDate: Date | null;
      image: string | null;
      tasksCompletedTotal: number;
      penalties: {
        overdue: Awaited<ReturnType<typeof applyOverduePenalty>>;
        inactivity: Awaited<ReturnType<typeof applyInactivityPenalty>>;
      };
    }
  | { ok: false; status: 404; error: string };

export async function getMe(userId: string): Promise<GetMeResult> {
  const weekStart = startOfWeekKey(TZ);
  await prisma.task.deleteMany({
    where: { userId, dayKey: { lt: weekStart } },
  });

  const overdue = await applyOverduePenalty(userId);
  const inactivity = await applyInactivityPenalty(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      level: true,
      xp: true,
      life: true,
      maxLife: true,
      gold: true,
      streakCount: true,
      lastCompletionDate: true,
      image: true,
      tasksCompletedTotal: true,
    },
  });

  if (!user) {
    return { ok: false, status: 404, error: "Usuário não encontrado" };
  }

  return { ok: true, ...user, penalties: { overdue, inactivity } };
}
