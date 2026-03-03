import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { Difficulty } from "@prisma/client";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
    try {
        const user = await requireUser();
        if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

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

        // ✅ update protegido por userId
        const updated = await prisma.task.updateMany({
            where: { id, userId: user.id },
            data,
        });

        if (updated.count === 0) {
            return NextResponse.json({ error: "Task não encontrada" }, { status: 404 });
        }

        const fresh = await prisma.task.findUnique({ where: { id } });
        if (!fresh) return NextResponse.json({ error: "Task não encontrada" }, { status: 404 });
        return NextResponse.json(fresh);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao atualizar task" }, { status: 500 });
    }
}

export async function DELETE(_: Request, { params }: Ctx) {
    try {
        const user = await requireUser();
        if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

        const { id } = await params;

        // ✅ delete protegido por userId
        const deleted = await prisma.task.deleteMany({
            where: { id, userId: user.id },
        });

        if (deleted.count === 0) {
            return NextResponse.json({ error: "Task não encontrada" }, { status: 404 });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao deletar task" }, { status: 500 });
    }
}