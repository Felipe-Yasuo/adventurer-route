import { prisma } from "@/lib/db/prisma";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

type OverdueTransactionClient = {
  task: typeof prisma.task;
  user: typeof prisma.user;
};

function damageByDifficulty(difficulty: Difficulty) {
  switch (difficulty) {
    case "EASY":
      return 1;
    case "MEDIUM":
      return 2;
    case "HARD":
      return 3;
  }
}

export async function applyOverduePenalty(userId: string) {
  const now = new Date();

  return prisma.$transaction(async (tx: OverdueTransactionClient) => {
    const overdue = await tx.task.findMany({
      where: {
        userId,
        completed: false,
        dueDate: { not: null, lt: now },
        overdueProcessedAt: null,
      },
      select: { id: true, difficulty: true },
    });

    if (overdue.length === 0) {
      return { appliedTasks: 0, totalDamage: 0 };
    }

    const totalDamage = overdue.reduce(
      (sum: number, t: (typeof overdue)[number]) =>
        sum + damageByDifficulty(t.difficulty as Difficulty),
      0
    );

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { life: true },
    });

    if (!user) return { appliedTasks: 0, totalDamage: 0 };

    const newLife = Math.max(0, user.life - totalDamage);

    await tx.user.update({
      where: { id: userId },
      data: { life: newLife },
    });

    await tx.task.updateMany({
      where: {
        id: {
          in: overdue.map((t: (typeof overdue)[number]) => t.id),
        },
      },
      data: { overdueProcessedAt: now },
    });

    return { appliedTasks: overdue.length, totalDamage };
  });
}
