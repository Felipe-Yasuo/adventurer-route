import { prisma } from "../src/lib/prisma";

async function seedItems() {
  await prisma.item.upsert({
    where: { type: "POTION_SMALL" },
    update: {},
    create: { type: "POTION_SMALL", name: "Poção Pequena", price: 10, healValue: 5 },
  });

  await prisma.item.upsert({
    where: { type: "POTION_MEDIUM" },
    update: {},
    create: { type: "POTION_MEDIUM", name: "Poção Média", price: 25, healValue: 12 },
  });

  await prisma.item.upsert({
    where: { type: "POTION_LARGE" },
    update: {},
    create: { type: "POTION_LARGE", name: "Poção Grande", price: 45, healValue: 25 },
  });
}

async function seedAchievements() {
  await prisma.achievement.upsert({
    where: { code: "FIRST_TASK" },
    update: {},
    create: {
      code: "FIRST_TASK",
      title: "Primeiro Sangue",
      description: "Conclua sua primeira task.",
      type: "TASKS_COMPLETED_TOTAL",
      target: 1,
      rewardGold: 10,
      rewardXp: 10,
    },
  });

  await prisma.achievement.upsert({
    where: { code: "TASKS_10" },
    update: {},
    create: {
      code: "TASKS_10",
      title: "Trabalhador",
      description: "Conclua 10 tasks.",
      type: "TASKS_COMPLETED_TOTAL",
      target: 10,
      rewardGold: 50,
      rewardXp: 30,
    },
  });

  await prisma.achievement.upsert({
    where: { code: "STREAK_3" },
    update: {},
    create: {
      code: "STREAK_3",
      title: "Em Chamas",
      description: "Mantenha 3 dias de streak.",
      type: "STREAK_REACHED",
      target: 3,
      rewardGold: 25,
      rewardXp: 20,
    },
  });

  await prisma.achievement.upsert({
    where: { code: "LEVEL_5" },
    update: {},
    create: {
      code: "LEVEL_5",
      title: "Aprendiz",
      description: "Chegue ao level 5.",
      type: "LEVEL_REACHED",
      target: 5,
      rewardGold: 40,
      rewardXp: 0,
    },
  });

  await prisma.achievement.upsert({
    where: { code: "GOLD_100" },
    update: {},
    create: {
      code: "GOLD_100",
      title: "Bolso Cheio",
      description: "Acumule 100 gold.",
      type: "GOLD_REACHED",
      target: 100,
      rewardGold: 0,
      rewardXp: 25,
    },
  });
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "yasuo@adventurer.route" },
    update: {},
    create: {
      name: "Yasuo",
      email: "yasuo@adventurer.route",
      level: 1,
      xp: 0,
      life: 10,
      maxLife: 10,
      gold: 0,
      avatarUrl: "https://api.dicebear.com/9.x/adventurer/png?seed=Yasuo",
    },
  });

  await seedItems();
  await seedAchievements();

  console.log("Seeded:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });