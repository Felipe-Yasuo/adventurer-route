import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDevUser } from "@/lib/devUser";
import { Difficulty } from "@prisma/client";

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
    try {
        const user = await getDevUser();
        const id = params.id;

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
            where: { id, userId: user.id },
            data,
        });

        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao atualizar task" }, { status: 500 });
    }
}

export async function DELETE(_: Request, { params }: Params) {
    try {
        const user = await getDevUser();
        const id = params.id;

        await prisma.task.delete({
            where: { id, userId: user.id },
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao deletar task" }, { status: 500 });
    }
}