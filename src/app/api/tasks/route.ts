import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Difficulty } from "@prisma/client";
import { todayKey } from "@/lib/game/time";
import { requireUser } from "@/lib/requireUser";

const TZ = "America/Sao_Paulo";

export async function GET(req: Request) {
    try {
        const user = await requireUser();
        if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

        const url = new URL(req.url);
        const dayKey = url.searchParams.get("dayKey"); // ✅

        const tasks = await prisma.task.findMany({
            where: { userId: user.id, ...(dayKey ? { dayKey } : {}) },
            orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
        });

        return NextResponse.json(tasks);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao listar tasks" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await requireUser();
        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const body = (await req.json()) as {
            title?: string;
            difficulty?: Difficulty;
            dueDate?: string | null;
            dayKey?: string; // opcional, se você quiser permitir criar em outro dia
        };

        const title = (body.title ?? "").trim();
        if (!title) {
            return NextResponse.json({ error: "title é obrigatório" }, { status: 400 });
        }

        const difficulty = body.difficulty ?? "EASY";
        const dayKey = (body.dayKey ?? todayKey(TZ)).trim();

        const task = await prisma.task.create({
            data: {
                title,
                difficulty,
                dueDate: body.dueDate ? new Date(body.dueDate) : null,
                userId: user.id,
                dayKey,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao criar task" }, { status: 500 });
    }
}