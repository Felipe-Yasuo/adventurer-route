import { prisma } from "@/lib/db/prisma";

export async function seedGlobalGameData() {
  await prisma.item.upsert({
    where: { type: "POTION_SMALL" },
    update: {},
    create: {
      type: "POTION_SMALL",
      name: "Poção Pequena",
      price: 10,
      healValue: 3,
    },
  });

  await prisma.item.upsert({
    where: { type: "POTION_MEDIUM" },
    update: {},
    create: {
      type: "POTION_MEDIUM",
      name: "Poção Média",
      price: 25,
      healValue: 6,
    },
  });

  await prisma.item.upsert({
    where: { type: "POTION_LARGE" },
    update: {},
    create: {
      type: "POTION_LARGE",
      name: "Poção Grande",
      price: 50,
      healValue: 10,
    },
  });

  await prisma.achievement.upsert({
    where: { code: "FIRST_TASK" },
    update: {},
    create: {
      code: "FIRST_TASK",
      title: "Primeira tarefa!",
      description: "Conclua sua primeira task.",
      type: "TASKS_COMPLETED_TOTAL",
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
      type: "STREAK_REACHED",
      target: 3,
      rewardGold: 30,
      rewardXp: 50,
    },
  });
}

export async function seedUserDefaults(userId: string) {
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
