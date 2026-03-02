
import { prisma } from "@/lib/prisma";

const TZ = "America/Sao_Paulo";

function todayKeyInTz(tz: string) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

export type QuestTemplate = {
    code: string;
    title: string;
    description: string;
    target: number;
    rewardXp: number;
    rewardGold: number;
};

export const DAILY_QUEST_TEMPLATES: QuestTemplate[] = [
    {
        code: "DAILY_COMPLETE_1",
        title: "Aqueça o motor",
        description: "Complete 1 tarefa hoje.",
        target: 1,
        rewardXp: 10,
        rewardGold: 5,
    },
    {
        code: "DAILY_COMPLETE_3",
        title: "Ritmo de aventura",
        description: "Complete 3 tarefas hoje.",
        target: 3,
        rewardXp: 25,
        rewardGold: 12,
    },
    {
        code: "DAILY_COMPLETE_HARD_1",
        title: "Desafio de verdade",
        description: "Complete 1 tarefa HARD hoje.",
        target: 1,
        rewardXp: 30,
        rewardGold: 15,
    },
];

export async function ensureTodayQuests(userId: string) {
    const dayKey = todayKeyInTz(TZ);

    await prisma.$transaction(async (tx) => {
        for (const q of DAILY_QUEST_TEMPLATES) {
            await tx.quest.upsert({
                where: {
                    userId_code_dayKey: { userId, code: q.code, dayKey },
                },
                create: {
                    userId,
                    type: "DAILY",
                    status: "ACTIVE",
                    code: q.code,
                    title: q.title,
                    description: q.description,
                    target: q.target,
                    progress: 0,
                    rewardXp: q.rewardXp,
                    rewardGold: q.rewardGold,
                    dayKey,
                },
                update: {},
            });
        }
    });

    return listTodayQuests(userId);
}

export async function listTodayQuests(userId: string) {
    const dayKey = todayKeyInTz(TZ);

    return prisma.quest.findMany({
        where: { userId, dayKey },
        orderBy: [{ status: "asc" }, { createdAt: "asc" }],
    });
}