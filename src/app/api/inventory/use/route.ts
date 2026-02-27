import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDevUser } from "@/lib/devUser";
import { clampHeal } from "@/lib/game/heal";

export async function POST(req: Request) {
    try {
        const devUser = await getDevUser();
        const body = (await req.json()) as { itemId?: string };



        if (!body.itemId) {
            return NextResponse.json({ error: "itemId é obrigatório" }, { status: 400 });
        }

        const itemId = body.itemId;

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: devUser.id },
                select: { id: true, life: true, maxLife: true },
            });

            if (!user) return { status: 404 as const, body: { error: "Usuário não encontrado" } };

            const inv = await tx.inventoryItem.findUnique({
                where: { userId_itemId: { userId: user.id, itemId: body.itemId! } },
                select: {
                    id: true,
                    quantity: true,
                    item: { select: { id: true, name: true, healValue: true } },
                },
            });

            if (!inv || inv.quantity <= 0) {
                return { status: 400 as const, body: { error: "Você não possui esse item" } };
            }

            if (user.life >= user.maxLife) {
                return { status: 400 as const, body: { error: "Vida já está cheia" } };
            }

            const { newLife, healed } = clampHeal(user.life, user.maxLife, inv.item.healValue);

            await tx.inventoryItem.update({
                where: { id: inv.id },
                data: { quantity: { decrement: 1 } },
            });

            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: { life: newLife },
                select: { id: true, life: true, maxLife: true },
            });

            return {
                status: 200 as const,
                body: {
                    healed,
                    user: updatedUser,
                    usedItem: { id: inv.item.id, name: inv.item.name, healValue: inv.item.healValue },
                    remaining: inv.quantity - 1,
                },
            };
        });

        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao usar item" }, { status: 500 });
    }
}