import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";


export async function GET() {
    try {
        const user = await requireUser();
        if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

        const inventory = await prisma.inventoryItem.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: "desc" },
            select: {
                id: true,
                quantity: true,
                item: { select: { id: true, type: true, name: true, price: true, healValue: true } },
            },
        });

        return NextResponse.json(inventory);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao listar inventário" }, { status: 500 });
    }
}