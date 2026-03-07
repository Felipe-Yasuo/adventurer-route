import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clampHeal } from "@/lib/game/heal";
import { requireUser } from "@/lib/requireUser";
import { useItemSchema } from "@/lib/validators/shop";
import { getFirstZodError } from "@/lib/validators/get-first-zod-error";

export async function POST(req: Request) {
    try {
        const me = await requireUser();
        if (!me) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

        const body = await req.json();
        const parsed = useItemSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
              { error: getFirstZodError(parsed.error) },
              { status: 400 }
            );
          }

        const { itemId } = parsed.data;

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: { id: me.id },
                select: { id: true, life: true, maxLife: true },
            });

            if (!user) return { status: 404 as const, body: { error: "Usuário não encontrado" } };

            const inv = await tx.inventoryItem.findUnique({
                where: { userId_itemId: { userId: user.id, itemId } },
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