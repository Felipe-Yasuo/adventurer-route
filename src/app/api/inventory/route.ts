import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDevUser } from "@/lib/devUser";

export async function GET() {
    try {
        const user = await getDevUser();

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