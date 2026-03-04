import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function POST(req: Request) {
    try {
        const requireuser = await requireUser();
        if (!requireuser) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        const body = (await req.json()) as { itemId?: string; quantity?: number };

        const itemId = body.itemId;
        const quantity = Math.max(1, Number(body.quantity ?? 1));

        if (!itemId) {
            return NextResponse.json({ error: "itemId é obrigatório" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: requireuser.id },
                select: { id: true, gold: true },
            });

            const item = await tx.item.findUnique({
                where: { id: itemId },
                select: { id: true, name: true, price: true, healValue: true, type: true },
            });

            if (!user) return { status: 404 as const, body: { error: "Usuário não encontrado" } };
            if (!item) return { status: 404 as const, body: { error: "Item não encontrado" } };

            const totalCost = item.price * quantity;
            if (user.gold < totalCost) {
                return { status: 400 as const, body: { error: "Gold insuficiente", gold: user.gold, totalCost } };
            }

            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: { gold: { decrement: totalCost } },
                select: { id: true, gold: true },
            });

            const inv = await tx.inventoryItem.upsert({
                where: { userId_itemId: { userId: user.id, itemId: item.id } },
                update: { quantity: { increment: quantity } },
                create: { userId: user.id, itemId: item.id, quantity },
                select: {
                    id: true,
                    quantity: true,
                    item: { select: { id: true, name: true, type: true, healValue: true, price: true } },
                },
            });

            return {
                status: 200 as const,
                body: { user: updatedUser, inventoryItem: inv, totalCost },
            };
        });

        return NextResponse.json(result.body, {
            status: result.status,
            headers: { "Cache-Control": "no-store" },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao comprar item" }, { status: 500 });
    }
}