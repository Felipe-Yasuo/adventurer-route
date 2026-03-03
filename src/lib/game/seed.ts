import { prisma } from "@/lib/prisma";
import { ItemType, AchievementType } from "@prisma/client";

export async function seedGlobalGameData() {
    // ✅ Itens da loja (globais)
    await prisma.item.upsert({
        where: { type: ItemType.POTION_SMALL },
        update: {},
        create: { type: ItemType.POTION_SMALL, name: "Poção Pequena", price: 10, healValue: 3 },
    });

    await prisma.item.upsert({
        where: { type: ItemType.POTION_MEDIUM },
        update: {},
        create: { type: ItemType.POTION_MEDIUM, name: "Poção Média", price: 25, healValue: 6 },
    });

    await prisma.item.upsert({
        where: { type: ItemType.POTION_LARGE },
        update: {},
        create: { type: ItemType.POTION_LARGE, name: "Poção Grande", price: 50, healValue: 10 },
    });

    await prisma.achievement.upsert({
        where: { code: "FIRST_TASK" },
        update: {},
        create: {
            code: "FIRST_TASK",
            title: "Primeira tarefa!",
            description: "Conclua sua primeira task.",
            type: AchievementType.TASKS_COMPLETED_TOTAL,
            target: 1,
            rewardGold: 10,
            rewardXp: 20,
        },
    });

    await prisma.achievement.upsert({
        where: { code: "STREAK_3" },
        update: {},
        create: {
            code: "STREAK_3",
            title: "Sequência 3 dias",
            description: "Complete tasks por 3 dias seguidos.",
            type: AchievementType.STREAK_REACHED,
            target: 3,
            rewardGold: 30,
            rewardXp: 50,
        },
    });
}

export async function seedUserDefaults(userId: string) {
    // Seus defaults já estão no schema, mas deixo isso pra garantir:
    await prisma.user.update({
        where: { id: userId },
        data: {
            level: 1,
            xp: 0,
            gold: 0,
            life: 10,
            maxLife: 10,
            streakCount: 0,
            tasksCompletedTotal: 0,
        },
    });

}