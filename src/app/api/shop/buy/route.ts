import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { buyItemSchema } from "@/lib/validators/shop";
import { getFirstZodError } from "@/lib/validators/get-first-zod-error";

export async function POST(req: Request) {
    try {
        const user = await requireUser();
        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = buyItemSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
                { error: getFirstZodError(parsed.error) },
                { status: 400 }
            );
        }

        const data = parsed.data;
        const itemId = data.itemId;
        const quantity = Math.max(1, Number(data.quantity ?? 1));

        const result = await prisma.$transaction(async (tx) => {
            const dbUser = await tx.user.findUnique({
                where: { id: user.id },
                select: { id: true, gold: true },
            });

            const item = await tx.item.findUnique({
                where: { id: itemId },
                select: { id: true, name: true, price: true, healValue: true, type: true },
            });

            if (!dbUser) {
                return { status: 404 as const, body: { error: "Usuário não encontrado" } };
            }

            if (!item) {
                return { status: 404 as const, body: { error: "Item não encontrado" } };
            }

            const totalCost = item.price * quantity;

            if (dbUser.gold < totalCost) {
                return {
                    status: 400 as const,
                    body: { error: "Gold insuficiente", gold: dbUser.gold, totalCost },
                };
            }

            const updatedUser = await tx.user.update({
                where: { id: dbUser.id },
                data: { gold: { decrement: totalCost } },
                select: { id: true, gold: true },
            });

            const inv = await tx.inventoryItem.upsert({
                where: { userId_itemId: { userId: dbUser.id, itemId: item.id } },
                update: { quantity: { increment: quantity } },
                create: { userId: dbUser.id, itemId: item.id, quantity },
                select: {
                    id: true,
                    quantity: true,
                    item: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                            healValue: true,
                            price: true,
                        },
                    },
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