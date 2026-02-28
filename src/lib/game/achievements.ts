import type { Prisma } from "@prisma/client";

export type UnlockResult = {
  unlocked: Array<{
    code: string;
    title: string;
    rewardGold: number;
    rewardXp: number;
  }>;
  totalRewardGold: number;
  totalRewardXp: number;
};


export async function checkAndUnlockAchievements(
  tx: Prisma.TransactionClient,
  userId: string
): Promise<UnlockResult> {
  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { level: true, gold: true, streakCount: true },
  });

  if (!user) return { unlocked: [], totalRewardGold: 0, totalRewardXp: 0 };

  const tasksCompletedTotal = await tx.task.count({
    where: { userId, completed: true },
  });

  const [allAchievements, unlockedRows] = await Promise.all([
    tx.achievement.findMany({
      select: {
        id: true,
        code: true,
        title: true,
        type: true,
        target: true,
        rewardGold: true,
        rewardXp: true,
      },
    }),
    tx.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true },
    }),
  ]);

  const unlockedSet = new Set(unlockedRows.map((r) => r.achievementId));

  const eligible = allAchievements.filter((a) => {
    if (unlockedSet.has(a.id)) return false;

    switch (a.type) {
      case "TASKS_COMPLETED_TOTAL":
        return tasksCompletedTotal >= a.target;
      case "STREAK_REACHED":
        return user.streakCount >= a.target;
      case "GOLD_REACHED":
        return user.gold >= a.target;
      case "LEVEL_REACHED":
        return user.level >= a.target;
      default:
        return false;
    }
  });

  if (eligible.length === 0) {
    return { unlocked: [], totalRewardGold: 0, totalRewardXp: 0 };
  }

  await tx.userAchievement.createMany({
    data: eligible.map((a) => ({ userId, achievementId: a.id })),
    skipDuplicates: true,
  });

  const totalRewardGold = eligible.reduce((sum, a) => sum + a.rewardGold, 0);
  const totalRewardXp = eligible.reduce((sum, a) => sum + a.rewardXp, 0);

  if (totalRewardGold > 0 || totalRewardXp > 0) {
    await tx.user.update({
      where: { id: userId },
      data: {
        gold: { increment: totalRewardGold },
        xp: { increment: totalRewardXp },
      },
    });
  }

  return {
    unlocked: eligible.map((a) => ({
      code: a.code,
      title: a.title,
      rewardGold: a.rewardGold,
      rewardXp: a.rewardXp,
    })),
    totalRewardGold,
    totalRewardXp,
  };
}