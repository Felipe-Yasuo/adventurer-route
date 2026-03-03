import { prisma } from "@/lib/prisma";
import { applyXpAndLevelUp } from "@/lib/game/progression";
import type { Difficulty, Prisma } from "@prisma/client";

type TaskForQuest = {
    difficulty: Difficulty;
};

export type QuestJustCompleted = {
    code: string;
    title: string;
    type: "DAILY" | "WEEKLY";
};

const TZ = "America/Sao_Paulo";

function todayKeyInTz(tz: string) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

function weekKeyInTz(tz: string) {
    // weekKey = segunda-feira da semana no fuso tz, em YYYY-MM-DD
    const todayKey = todayKeyInTz(tz);
    const [y, m, d] = todayKey.split("-").map(Number);
    const local = new Date(y, m - 1, d, 12, 0, 0);

    // 0=Dom ... 6=Sáb
    const jsDay = local.getDay();
    const diffToMonday = (jsDay + 6) % 7;

    local.setDate(local.getDate() - diffToMonday);

    const yy = local.getFullYear();
    const mm = String(local.getMonth() + 1).padStart(2, "0");
    const dd = String(local.getDate()).padStart(2, "0");
    return `${yy}-${mm}-${dd}`;
}

export type QuestTemplate = {
    code: string;
    title: string;
    description: string;
    target: number;
    rewardXp: number;
    rewardGold: number;
};

export type QuestClaimResult = {
    quest: any;
    rewards: { xp: number; gold: number };
    leveledUp: number;
    user: any;
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

export const WEEKLY_QUEST_TEMPLATES: QuestTemplate[] = [
    {
        code: "WEEKLY_COMPLETE_10",
        title: "Maratona da semana",
        description: "Complete 10 tarefas nesta semana.",
        target: 10,
        rewardXp: 120,
        rewardGold: 60,
    },
    {
        code: "WEEKLY_COMPLETE_HARD_3",
        title: "Semana casca-grossa",
        description: "Complete 3 tarefas HARD nesta semana.",
        target: 3,
        rewardXp: 150,
        rewardGold: 80,
    },
];

export async function ensureTodayQuests(userId: string) {
    const dayKey = todayKeyInTz(TZ);
    const weekKey = weekKeyInTz(TZ);

    await prisma.$transaction(async (tx) => {
        // ✅ “Sumir” quests antigas (não expira, remove)
        await tx.quest.deleteMany({
            where: { userId, type: "DAILY", dayKey: { not: dayKey } },
        });

        await tx.quest.deleteMany({
            where: { userId, type: "WEEKLY", weekKey: { not: weekKey } },
        });

        // DAILY
        for (const q of DAILY_QUEST_TEMPLATES) {
            await tx.quest.upsert({
                where: { userId_code_dayKey: { userId, code: q.code, dayKey } },
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
                    weekKey: null,
                },
                update: {},
            });
        }

        // WEEKLY
        for (const q of WEEKLY_QUEST_TEMPLATES) {
            await tx.quest.upsert({
                where: { userId_code_weekKey: { userId, code: q.code, weekKey } },
                create: {
                    userId,
                    type: "WEEKLY",
                    status: "ACTIVE",
                    code: q.code,
                    title: q.title,
                    description: q.description,
                    target: q.target,
                    progress: 0,
                    rewardXp: q.rewardXp,
                    rewardGold: q.rewardGold,
                    weekKey,
                    dayKey: null,
                },
                update: {},
            });
        }
    });

    return listTodayQuests(userId);
}

export async function listTodayQuests(userId: string) {
    const dayKey = todayKeyInTz(TZ);
    const weekKey = weekKeyInTz(TZ);

    return prisma.quest.findMany({
        where: { userId, OR: [{ dayKey }, { weekKey }] },
        orderBy: [{ type: "asc" }, { createdAt: "asc" }],
    });
}

export async function claimQuest(
    userId: string,
    questId: string
): Promise<QuestClaimResult> {
    return prisma.$transaction(async (tx) => {

        const quest = await tx.quest.findFirst({
            where: { id: questId, userId },
        });

        if (!quest) throw new Error("Quest não encontrada");

        if (quest.progress < quest.target) {
            throw new Error("Quest ainda não foi completada");
        }
        const claimed = await tx.quest.updateMany({
            where: { id: questId, userId, status: "ACTIVE" },
            data: { status: "CLAIMED", claimedAt: new Date() },
        });

        if (claimed.count === 0) {

            throw new Error("Quest já foi resgatada ou não está ativa");
        }


        const user = await tx.user.findUnique({
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
                tasksCompletedTotal: true,
                avatarUrl: true,
                name: true,
                email: true,
            },
        });

        if (!user) throw new Error("Usuário não encontrado");

        const rewards = { xp: quest.rewardXp, gold: quest.rewardGold };
        const progressed = applyXpAndLevelUp(
            { level: user.level, xp: user.xp },
            rewards.xp
        );

        const updatedUser = await tx.user.update({
            where: { id: userId },
            data: {
                xp: progressed.xp,
                level: progressed.level,
                gold: { increment: rewards.gold },
            },
            select: {
                id: true,
                level: true,
                xp: true,
                gold: true,
                life: true,
                maxLife: true,
                streakCount: true,
                lastCompletionDate: true,
                tasksCompletedTotal: true,
                avatarUrl: true,
                name: true,
                email: true,
            },
        });

        const updatedQuest = await tx.quest.findUnique({
            where: { id: questId },
        });

        return {
            quest: updatedQuest,
            rewards,
            leveledUp: progressed.leveledUp ?? 0,
            user: updatedUser,
        };
    });
}
export async function onTaskCompletedUpdateQuests(
    tx: Prisma.TransactionClient,
    userId: string,
    task: TaskForQuest
): Promise<QuestJustCompleted[]> {
    const dayKey = todayKeyInTz(TZ);
    const weekKey = weekKeyInTz(TZ);

    for (const q of DAILY_QUEST_TEMPLATES) {
        await tx.quest.upsert({
            where: { userId_code_dayKey: { userId, code: q.code, dayKey } },
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
                weekKey: null,
            },
            update: {},
        });
    }

    for (const q of WEEKLY_QUEST_TEMPLATES) {
        await tx.quest.upsert({
            where: { userId_code_weekKey: { userId, code: q.code, weekKey } },
            create: {
                userId,
                type: "WEEKLY",
                status: "ACTIVE",
                code: q.code,
                title: q.title,
                description: q.description,
                target: q.target,
                progress: 0,
                rewardXp: q.rewardXp,
                rewardGold: q.rewardGold,
                weekKey,
                dayKey: null,
            },
            update: {},
        });
    }

    async function bumpDaily(code: string, amount: number) {
        const quest = await tx.quest.findFirst({
            where: { userId, dayKey, code, status: "ACTIVE" },
            select: { id: true, progress: true, target: true },
        });
        if (!quest) return false;

        const next = Math.min(quest.target, quest.progress + amount);
        if (next === quest.progress) return false;

        await tx.quest.update({
            where: { id: quest.id },
            data: { progress: next },
        });

        return quest.progress < quest.target && next >= quest.target;
    }

    async function bumpWeekly(code: string, amount: number) {
        const quest = await tx.quest.findFirst({
            where: { userId, weekKey, code, status: "ACTIVE" },
            select: { id: true, progress: true, target: true },
        });
        if (!quest) return false;

        const next = Math.min(quest.target, quest.progress + amount);
        if (next === quest.progress) return false;

        await tx.quest.update({
            where: { id: quest.id },
            data: { progress: next },
        });

        return quest.progress < quest.target && next >= quest.target;
    }

    const newly: QuestJustCompleted[] = [];

    if (await bumpDaily("DAILY_COMPLETE_1", 1)) {
        newly.push({ code: "DAILY_COMPLETE_1", title: "Aqueça o motor", type: "DAILY" });
    }

    if (await bumpDaily("DAILY_COMPLETE_3", 1)) {
        newly.push({ code: "DAILY_COMPLETE_3", title: "Ritmo de aventura", type: "DAILY" });
    }

    if (task.difficulty === "HARD") {
        if (await bumpDaily("DAILY_COMPLETE_HARD_1", 1)) {
            newly.push({
                code: "DAILY_COMPLETE_HARD_1",
                title: "Desafio de verdade",
                type: "DAILY",
            });
        }
    }

    if (await bumpWeekly("WEEKLY_COMPLETE_10", 1)) {
        newly.push({
            code: "WEEKLY_COMPLETE_10",
            title: "Maratona da semana",
            type: "WEEKLY",
        });
    }

    if (task.difficulty === "HARD") {
        if (await bumpWeekly("WEEKLY_COMPLETE_HARD_3", 1)) {
            newly.push({
                code: "WEEKLY_COMPLETE_HARD_3",
                title: "Semana casca-grossa",
                type: "WEEKLY",
            });
        }
    }

    return newly;
}