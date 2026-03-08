import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rewardsByDifficulty } from "@/lib/game/rules";
import { applyXpAndLevelUp } from "@/lib/game/progression";
import { dateKeyInTz, diffDaysByDateKey } from "@/lib/game/time";
import { checkAndUnlockAchievements } from "@/lib/game/achievements";
import { onTaskCompletedUpdateQuests } from "@/lib/game/quests";
import { requireUser } from "@/lib/requireUser";

const TZ = "America/Sao_Paulo";

type QuestsTx = Parameters<typeof onTaskCompletedUpdateQuests>[0];
type AchievementsTx = Parameters<typeof checkAndUnlockAchievements>[0];

type CompleteTaskTransactionClient = QuestsTx &
  AchievementsTx & {
    task: typeof prisma.task;
  };

export async function PATCH(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireUser();
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { id: taskId } = await params;

    const result = await prisma.$transaction(
      async (tx: CompleteTaskTransactionClient) => {
        const task = await tx.task.findFirst({
          where: { id: taskId, userId: user.id },
          select: { id: true, userId: true, difficulty: true, completed: true },
        });

        if (!task) {
          return { status: 404 as const, body: { error: "Task não encontrada" } };
        }

        const now = new Date();

        const updatedCount = await tx.task.updateMany({
          where: { id: taskId, userId: user.id, completed: false },
          data: { completed: true, completedAt: now },
        });

        if (updatedCount.count === 0) {
          return { status: 400 as const, body: { error: "Task já concluída" } };
        }

        const updatedTask = await tx.task.findFirst({
          where: { id: taskId, userId: user.id },
        });

        if (!updatedTask) {
          return { status: 404 as const, body: { error: "Task não encontrada" } };
        }

        const rewards = rewardsByDifficulty(task.difficulty);

        const newlyCompletedQuests = await onTaskCompletedUpdateQuests(tx, user.id, {
          difficulty: task.difficulty,
        });

        const currentUser = await tx.user.findUnique({
          where: { id: user.id },
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

        const todayKey = dateKeyInTz(now, TZ);

        let newStreak = currentUser.streakCount;

        if (!currentUser.lastCompletionDate) {
          newStreak = 1;
        } else {
          const lastKey = dateKeyInTz(currentUser.lastCompletionDate, TZ);
          const diffDays = diffDaysByDateKey(lastKey, todayKey);

          if (diffDays === 0) newStreak = currentUser.streakCount;
          else if (diffDays === 1) newStreak = currentUser.streakCount + 1;
          else newStreak = 1;
        }

        const updatedUser = await tx.user.update({
          where: { id: user.id },
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

        const achievementsResult = await checkAndUnlockAchievements(tx, user.id);

        const finalUser = await tx.user.findUnique({
          where: { id: user.id },
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
      }
    );

    return NextResponse.json(result.body, { status: result.status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao concluir task" }, { status: 500 });
  }
}