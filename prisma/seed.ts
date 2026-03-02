import { prisma } from "../src/lib/prisma";

async function main() {
  const DEV_USER_EMAIL = "yasuo@adventurer.route";

  await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: {},
    create: {
      name: "Yasuo",
      email: DEV_USER_EMAIL,
      level: 1,
      xp: 0,
      life: 10,
      maxLife: 10,
      gold: 0,
      streakCount: 0,
      tasksCompletedTotal: 0,
      avatarUrl: "https://api.dicebear.com/9.x/adventurer/png?seed=Yasuo",
    },
  });

  console.log("Seed OK:", DEV_USER_EMAIL);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });