import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEV_USER_EMAIL = "yasuo@adventurer.route";

export async function GET() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: DEV_USER_EMAIL },
            select: {
                id: true,
                name: true,
                email: true,
                level: true,
                xp: true,
                life: true,
                maxLife: true,
                gold: true,
                streakCount: true,
                lastCompletionDate: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Usuário de teste não encontrado. Rode o seed." },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro ao buscar usuário" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: Request) {
    try {
        const body = (await req.json()) as Partial<{
            name: string | null;
            avatarUrl: string | null;
            life: number;
            maxLife: number;
            xp: number;
            level: number;
            gold: number;
            streakCount: number;
        }>;

        const data: Record<string, unknown> = {};

        if ("name" in body) data.name = body.name ?? null;
        if ("avatarUrl" in body) data.avatarUrl = body.avatarUrl ?? null;

        if (typeof body.life === "number") data.life = body.life;
        if (typeof body.maxLife === "number") data.maxLife = body.maxLife;
        if (typeof body.xp === "number") data.xp = body.xp;
        if (typeof body.level === "number") data.level = body.level;
        if (typeof body.gold === "number") data.gold = body.gold;
        if (typeof body.streakCount === "number") data.streakCount = body.streakCount;

        const updated = await prisma.user.update({
            where: { email: DEV_USER_EMAIL },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                level: true,
                xp: true,
                life: true,
                maxLife: true,
                gold: true,
                streakCount: true,
                lastCompletionDate: true,
                avatarUrl: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Erro ao atualizar usuário" },
            { status: 500 }
        );
    }
}