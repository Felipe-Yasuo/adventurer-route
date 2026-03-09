import { prisma } from "@/lib/prisma";
import { rewardsByDifficulty } from "@/lib/game/rules";
import { applyXpAndLevelUp } from "@/lib/game/progression";
import { dateKeyInTz, diffDaysByDateKey } from "@/lib/game/time";
import { checkAndUnlockAchievements } from "@/lib/game/achievements";
import { onTaskCompletedUpdateQuests } from "@/lib/game/quests";
import type { TaskApi } from "@/features/tasks/types";

const TZ = "America/Sao_Paulo";

type QuestsTx = Parameters<typeof onTaskCompletedUpdateQuests>[0];
type AchievementsTx = Parameters<typeof checkAndUnlockAchievements>[0];
type CompleteTx = QuestsTx & AchievementsTx & { task: typeof prisma.task };

export type CompleteTaskResult =
  | {
      ok: true;
      task: TaskApi;
      rewards: ReturnType<typeof rewardsByDifficulty>;
      leveledUp: number;
      user: {
        id: string;
        level: number;
        xp: number;
        life: number;
        maxLife: number;
        gold: number;
        streakCount: number;
        lastCompletionDate: Date | null;
      };
      achievements: Awaited<ReturnType<typeof checkAndUnlockAchievements>>;
      questsCompleted: Awaited<ReturnType<typeof onTaskCompletedUpdateQuests>>;
    }
  | { ok: false; status: 400 | 404; error: string };

export async function completeTask(
  userId: string,
  taskId: string
): Promise<CompleteTaskResult> {
  const result = await prisma.$transaction(async (tx: CompleteTx) => {
    const task = await tx.task.findFirst({
      where: { id: taskId, userId },
      select: { id: true, userId: true, difficulty: true, completed: true },
    });

    if (!task) {
      return { status: 404 as const, body: { error: "Task não encontrada" } };
    }

    const now = new Date();

    const updatedCount = await tx.task.updateMany({
      where: { id: taskId, userId, completed: false },
      data: { completed: true, completedAt: now },
    });

    if (updatedCount.count === 0) {
      return { status: 400 as const, body: { error: "Task já concluída" } };
    }

    const updatedTask = await tx.task.findFirst({ where: { id: taskId, userId } });
    if (!updatedTask) {
      return { status: 404 as const, body: { error: "Task não encontrada" } };
    }

    const rewards = rewardsByDifficulty(task.difficulty);
    const newlyCompletedQuests = await onTaskCompletedUpdateQuests(tx, userId, {
      difficulty: task.difficulty,
    });

    const currentUser = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        level: true,
        xp: true,
        gold: true,
        life: true,
        maxLife: true,
        streakCount: true,
        lastCompletionDate: true,
      },
    });

    if (!currentUser) {
      return { status: 404 as const, body: { error: "Usuário não encontrado" } };
    }

    const progressed = applyXpAndLevelUp(
      { level: currentUser.level, xp: currentUser.xp },
      rewards.xp
    );
    const todayDateKey = dateKeyInTz(now, TZ);

    let newStreak = currentUser.streakCount;
    if (!currentUser.lastCompletionDate) {
      newStreak = 1;
    } else {
      const lastKey = dateKeyInTz(currentUser.lastCompletionDate, TZ);
      const diffDays = diffDaysByDateKey(lastKey, todayDateKey);
      if (diffDays === 0) newStreak = currentUser.streakCount;
      else if (diffDays === 1) newStreak = currentUser.streakCount + 1;
      else newStreak = 1;
    }

    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: {
        xp: progressed.xp,
        level: progressed.level,
        gold: { increment: rewards.gold },
        tasksCompletedTotal: { increment: 1 },
        streakCount: newStreak,
        lastCompletionDate: now,
      },
      select: {
        id: true,
        level: true,
        xp: true,
        life: true,
        maxLife: true,
        gold: true,
        streakCount: true,
        lastCompletionDate: true,
        tasksCompletedTotal: true,
      },
    });

    const achievementsResult = await checkAndUnlockAchievements(tx, userId);

    const finalUser = await tx.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        level: true,
        xp: true,
        life: true,
        maxLife: true,
        gold: true,
        streakCount: true,
        lastCompletionDate: true,
      },
    });

    return {
      status: 200 as const,
      body: {
        task: updatedTask,
        rewards,
        leveledUp: progressed.leveledUp,
        user: finalUser ?? updatedUser,
        achievements: achievementsResult,
        questsCompleted: newlyCompletedQuests,
      },
    };
  });

  if (result.status !== 200) {
    return { ok: false, status: result.status, error: result.body.error };
  }

  return { ok: true, ...result.body, task: result.body.task as unknown as TaskApi };
}
