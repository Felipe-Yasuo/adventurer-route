import { prisma } from "@/lib/prisma";

export const DEV_USER_EMAIL = "yasuo@adventurer.route";

export async function getDevUser() {
    const user = await prisma.user.findUnique({
        where: { email: DEV_USER_EMAIL },
        select: { id: true, email: true },
    });

    if (!user) {
        throw new Error("Usuário de teste não encontrado. Rode o seed.");
    }

    return user;
}