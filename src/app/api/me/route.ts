import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { applyOverduePenalty } from "@/lib/game/overdue";
import { applyInactivityPenalty } from "@/lib/game/inactivity";
import { startOfWeekKey } from "@/lib/game/time";

const TZ = "America/Sao_Paulo";

export async function GET() {
    try {
        const u = await requireUser();

        if (!u) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        console.log("ME ROUTE requireUser id:", u.id);
        console.log("ME ROUTE requireUser email:", u.email);

        const beforeUser = await prisma.user.findUnique({
            where: { id: u.id },
            select: {
                id: true,
                image: true,
            },
        });

        console.log("ANTES das penalidades image:", beforeUser?.image);

        const weekStart = startOfWeekKey(TZ);

        await prisma.task.deleteMany({
            where: {
                userId: u.id,
                dayKey: { lt: weekStart },
            },
        });

        const overdue = await applyOverduePenalty(u.id);
        const inactivity = await applyInactivityPenalty(u.id);

        const afterPenaltyUser = await prisma.user.findUnique({
            where: { id: u.id },
            select: {
                id: true,
                image: true,
            },
        });

        console.log("DEPOIS das penalidades image:", afterPenaltyUser?.image);

        const user = await prisma.user.findUnique({
            where: { id: u.id },
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
                image: true,
                tasksCompletedTotal: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        console.log("ME ROUTE prisma user id:", user.id);
        console.log("ME ROUTE prisma user image:", user.image);

        return NextResponse.json(
            {
                ...user,
                penalties: { overdue, inactivity },
            },
            {
                headers: { "Cache-Control": "no-store" },
            }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
    }
}