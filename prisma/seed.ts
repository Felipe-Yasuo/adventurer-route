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
    await seedItems();
    console.log("Seeded:", user.email);
}

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

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });