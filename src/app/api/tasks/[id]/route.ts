import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDevUser } from "@/lib/devUser";
import { Difficulty } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
    try {
        const user = await getDevUser();

        const { id } = await params;

        const body = (await req.json()) as Partial<{
            title: string;
            difficulty: Difficulty;
            dueDate: string | null;
            completed: boolean;
        }>;

        const data: Record<string, unknown> = {};

        if (typeof body.title === "string") {
            const t = body.title.trim();
            if (!t) return NextResponse.json({ error: "title inválido" }, { status: 400 });
            data.title = t;
        }

        if (body.difficulty) data.difficulty = body.difficulty;
        if ("dueDate" in body) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;

        if (typeof body.completed === "boolean") {
            data.completed = body.completed;
            data.completedAt = body.completed ? new Date() : null;
        }

        const updated = await prisma.task.update({
            where: { id },
            data,
        });


        if (updated.userId !== user.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
        }

        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao atualizar task" }, { status: 500 });
    }
}

export async function DELETE(_: Request, { params }: Ctx) {
    try {
        const user = await getDevUser();
        const { id } = await params;

        // ✅ primeiro garante que é do usuário
        const task = await prisma.task.findFirst({ where: { id, userId: user.id } });
        if (!task) return NextResponse.json({ error: "Task não encontrada" }, { status: 404 });

        await prisma.task.delete({ where: { id } });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao deletar task" }, { status: 500 });
    }
}