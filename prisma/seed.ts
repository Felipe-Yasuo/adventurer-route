import { prisma } from "../src/lib/prisma";

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