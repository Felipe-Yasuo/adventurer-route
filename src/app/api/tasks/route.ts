import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { todayKey } from "@/lib/game/time";
import { requireUser } from "@/lib/requireUser";
import { createTaskSchema } from "@/features/tasks/schemas/task.schema";
import { getFirstZodError } from "@/lib/http/get-first-zod-error";

const TZ = "America/Sao_Paulo";

export async function GET(req: Request) {
    try {
        const user = await requireUser();
        if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

        const url = new URL(req.url);
        const dayKey = url.searchParams.get("dayKey");

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
    function todayNoon() {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        return d;
    }

    try {
        const user = await requireUser();
        if (!user) {
            return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

        const body = await req.json();
        const parsed = createTaskSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
              { error: getFirstZodError(parsed.error) },
              { status: 400 }
            );
          }

        const { title, difficulty, dueDate, dayKey } = parsed.data;

        const resolvedDayKey = (dayKey ?? todayKey(TZ)).trim();

        const resolvedDueDate =
            dueDate && dueDate.trim().length > 0
                ? new Date(dueDate)
                : todayNoon();

        if (Number.isNaN(resolvedDueDate.getTime())) {
            return NextResponse.json({ error: "dueDate inválida" }, { status: 400 });
        }

        const task = await prisma.task.create({
            data: {
                title,
                difficulty: difficulty ?? "EASY",
                dueDate: resolvedDueDate,
                userId: user.id,
                dayKey: resolvedDayKey,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao criar task" }, { status: 500 });
    }
}