import { prisma } from "@/lib/prisma";

type Difficulty = "EASY" | "MEDIUM" | "HARD";

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

    return prisma.$transaction(async (tx) => {
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
            (sum, t) => sum + damageByDifficulty(t.difficulty as Difficulty),
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
            where: { id: { in: overdue.map((t) => t.id) } },
            data: { overdueProcessedAt: now },
        });

        return { appliedTasks: overdue.length, totalDamage };
    });
}