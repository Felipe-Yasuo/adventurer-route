import { prisma } from "@/lib/prisma";
import { applyXpAndLevelUp } from "@/lib/game/progression";
import type { Difficulty } from "@prisma/client";

type TaskForQuest = {
  difficulty: Difficulty;
};

type QuestsTransactionClient = {
  quest: typeof prisma.quest;
  user: typeof prisma.user;
};

export type QuestJustCompleted = {
  code: string;
  title: string;
  type: "DAILY" | "WEEKLY";
};

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

const TZ = "America/Sao_Paulo";

function hashStringToInt(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickDeterministic<T>(arr: T[], count: number, seedStr: string): T[] {
  if (count <= 0) return [];
  if (arr.length <= count) return [...arr];

  const pool = [...arr];
  const picked: T[] = [];

  let seed = hashStringToInt(seedStr);

  while (picked.length < count && pool.length > 0) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const idx = seed % pool.length;
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }

  return picked;
}

function todayKeyInTz(tz: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function weekKeyInTz(tz: string) {
  const todayKey = todayKeyInTz(tz);
  const [y, m, d] = todayKey.split("-").map(Number);
  const local = new Date(y, m - 1, d, 12, 0, 0);

  const jsDay = local.getDay();
  const diffToMonday = (jsDay + 6) % 7;

  local.setDate(local.getDate() - diffToMonday);

  const yy = local.getFullYear();
  const mm = String(local.getMonth() + 1).padStart(2, "0");
  const dd = String(local.getDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

export const DAILY_POOL: QuestTemplate[] = [
  { code: "DAILY_COMPLETE_1", title: "Aqueça o motor", description: "Complete 1 tarefa hoje.", target: 1, rewardXp: 10, rewardGold: 5 },
  { code: "DAILY_COMPLETE_2", title: "Dois passos", description: "Complete 2 tarefas hoje.", target: 2, rewardXp: 18, rewardGold: 9 },
  { code: "DAILY_COMPLETE_3", title: "Ritmo de aventura", description: "Complete 3 tarefas hoje.", target: 3, rewardXp: 25, rewardGold: 12 },
  { code: "DAILY_COMPLETE_5", title: "Dia produtivo", description: "Complete 5 tarefas hoje.", target: 5, rewardXp: 45, rewardGold: 22 },
  { code: "DAILY_COMPLETE_HARD_1", title: "Desafio de verdade", description: "Complete 1 tarefa HARD hoje.", target: 1, rewardXp: 30, rewardGold: 15 },
  { code: "DAILY_COMPLETE_MEDIUM_2", title: "Sem moleza", description: "Complete 2 tarefas MEDIUM hoje.", target: 2, rewardXp: 35, rewardGold: 18 },
];

export const WEEKLY_POOL: QuestTemplate[] = [
  { code: "WEEKLY_COMPLETE_8", title: "Aquecimento semanal", description: "Complete 8 tarefas nesta semana.", target: 8, rewardXp: 95, rewardGold: 45 },
  { code: "WEEKLY_COMPLETE_10", title: "Maratona da semana", description: "Complete 10 tarefas nesta semana.", target: 10, rewardXp: 120, rewardGold: 60 },
  { code: "WEEKLY_COMPLETE_15", title: "Imparável", description: "Complete 15 tarefas nesta semana.", target: 15, rewardXp: 180, rewardGold: 90 },
  { code: "WEEKLY_COMPLETE_HARD_3", title: "Semana casca-grossa", description: "Complete 3 tarefas HARD nesta semana.", target: 3, rewardXp: 150, rewardGold: 80 },
  { code: "WEEKLY_COMPLETE_MEDIUM_6", title: "Constância", description: "Complete 6 tarefas MEDIUM nesta semana.", target: 6, rewardXp: 140, rewardGold: 70 },
];

function dailyTemplatesForDay(dayKey: string) {
  return pickDeterministic(DAILY_POOL, 3, `daily:${dayKey}`);
}

function weeklyTemplatesForWeek(weekKey: string) {
  return pickDeterministic(WEEKLY_POOL, 2, `weekly:${weekKey}`);
}

function dailyUpsertArgs(userId: string, dayKey: string, q: QuestTemplate) {
  return {
    where: { userId_code_dayKey: { userId, code: q.code, dayKey } },
    create: {
      userId,
      type: "DAILY" as const,
      status: "ACTIVE" as const,
      code: q.code,
      title: q.title,
      description: q.description,
      target: q.target,
      progress: 0,
      rewardXp: q.rewardXp,
      rewardGold: q.rewardGold,
      dayKey,
      weekKey: null,
      claimedAt: null,
    },
    update: {
      title: q.title,
      description: q.description,
      target: q.target,
      rewardXp: q.rewardXp,
      rewardGold: q.rewardGold,
      dayKey,
      weekKey: null,
    },
  };
}

function weeklyUpsertArgs(userId: string, weekKey: string, q: QuestTemplate) {
  return {
    where: { userId_code_weekKey: { userId, code: q.code, weekKey } },
    create: {
      userId,
      type: "WEEKLY" as const,
      status: "ACTIVE" as const,
      code: q.code,
      title: q.title,
      description: q.description,
      target: q.target,
      progress: 0,
      rewardXp: q.rewardXp,
      rewardGold: q.rewardGold,
      weekKey,
      dayKey: null,
      claimedAt: null,
    },
    update: {
      title: q.title,
      description: q.description,
      target: q.target,
      rewardXp: q.rewardXp,
      rewardGold: q.rewardGold,
      weekKey,
      dayKey: null,
    },
  };
}

function isDailyCompleteAny(code: string) {
  return code.startsWith("DAILY_COMPLETE_") && !code.includes("_HARD_") && !code.includes("_MEDIUM_");
}

function isWeeklyCompleteAny(code: string) {
  return code.startsWith("WEEKLY_COMPLETE_") && !code.includes("_HARD_") && !code.includes("_MEDIUM_");
}

export async function ensureTodayQuests(userId: string) {
  const dayKey = todayKeyInTz(TZ);
  const weekKey = weekKeyInTz(TZ);

  await prisma.$transaction(async (tx: QuestsTransactionClient) => {
    await tx.quest.deleteMany({
      where: { userId, type: "DAILY", dayKey: { not: dayKey } },
    });

    await tx.quest.deleteMany({
      where: { userId, type: "WEEKLY", weekKey: { not: weekKey } },
    });

    const daily = dailyTemplatesForDay(dayKey);
    const weekly = weeklyTemplatesForWeek(weekKey);

    for (const q of daily) {
      await tx.quest.upsert(dailyUpsertArgs(userId, dayKey, q));
    }

    for (const q of weekly) {
      await tx.quest.upsert(weeklyUpsertArgs(userId, weekKey, q));
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

export async function claimQuest(userId: string, questId: string): Promise<QuestClaimResult> {
  return prisma.$transaction(async (tx: QuestsTransactionClient) => {
    const quest = await tx.quest.findFirst({ where: { id: questId, userId } });
    if (!quest) throw new Error("Quest não encontrada");

    if (quest.progress < quest.target) throw new Error("Quest ainda não foi completada");

    const claimed = await tx.quest.updateMany({
      where: { id: questId, userId, status: "ACTIVE" },
      data: { status: "CLAIMED", claimedAt: new Date() },
    });

    if (claimed.count === 0) throw new Error("Quest já foi resgatada ou não está ativa");

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
        image: true,
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
        image: true,
        name: true,
        email: true,
      },
    });

    const updatedQuest = await tx.quest.findUnique({ where: { id: questId } });

    return {
      quest: updatedQuest,
      rewards,
      leveledUp: progressed.leveledUp ?? 0,
      user: updatedUser,
    };
  });
}

export async function onTaskCompletedUpdateQuests(
  tx: QuestsTransactionClient,
  userId: string,
  task: TaskForQuest
): Promise<QuestJustCompleted[]> {
  const dayKey = todayKeyInTz(TZ);
  const weekKey = weekKeyInTz(TZ);

  const daily = dailyTemplatesForDay(dayKey);
  const weekly = weeklyTemplatesForWeek(weekKey);

  for (const q of daily) {
    await tx.quest.upsert(dailyUpsertArgs(userId, dayKey, q));
  }

  for (const q of weekly) {
    await tx.quest.upsert(weeklyUpsertArgs(userId, weekKey, q));
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

  for (const q of daily) {
    if (isDailyCompleteAny(q.code)) {
      if (await bumpDaily(q.code, 1)) {
        newly.push({ code: q.code, title: q.title, type: "DAILY" });
      }
    }

    if (task.difficulty === "HARD" && q.code.includes("_HARD_")) {
      if (await bumpDaily(q.code, 1)) {
        newly.push({ code: q.code, title: q.title, type: "DAILY" });
      }
    }

    if (task.difficulty === "MEDIUM" && q.code.includes("_MEDIUM_")) {
      if (await bumpDaily(q.code, 1)) {
        newly.push({ code: q.code, title: q.title, type: "DAILY" });
      }
    }
  }

  for (const q of weekly) {
    if (isWeeklyCompleteAny(q.code)) {
      if (await bumpWeekly(q.code, 1)) {
        newly.push({ code: q.code, title: q.title, type: "WEEKLY" });
      }
    }

    if (task.difficulty === "HARD" && q.code.includes("_HARD_")) {
      if (await bumpWeekly(q.code, 1)) {
        newly.push({ code: q.code, title: q.title, type: "WEEKLY" });
      }
    }

    if (task.difficulty === "MEDIUM" && q.code.includes("_MEDIUM_")) {
      if (await bumpWeekly(q.code, 1)) {
        newly.push({ code: q.code, title: q.title, type: "WEEKLY" });
      }
    }
  }

  return newly;
}