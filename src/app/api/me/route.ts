import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyOverduePenalty } from "@/lib/game/overdue";
import { applyInactivityPenalty } from "@/lib/game/inactivity";
import { startOfWeekKey } from "@/lib/game/time";

const DEV_USER_EMAIL = "yasuo@adventurer.route";

const TZ = "America/Sao_Paulo";




export async function GET() {
    try {
        const base = await prisma.user.findUnique({
            where: { email: DEV_USER_EMAIL },
            select: { id: true },
        });


        if (!base) {
            return NextResponse.json({ error: "Usuário de teste não encontrado. Rode o seed." }, { status: 404 });
        }



        const weekStart = startOfWeekKey(TZ);

        await prisma.task.deleteMany({
            where: {
                userId: base.id,
                dayKey: { lt: weekStart },
            },
        });

        const overdue = await applyOverduePenalty(base.id);
        const inactivity = await applyInactivityPenalty(base.id);

        const user = await prisma.user.findUnique({
            where: { id: base.id },
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
            },
        });

        return NextResponse.json({
            ...user,
            penalties: { overdue, inactivity },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
    }
}