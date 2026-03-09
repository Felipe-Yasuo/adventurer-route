import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { updateTaskSchema } from "@/features/tasks/schemas/task.schema";
import { getFirstZodError } from "@/lib/http/get-first-zod-error";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
    try {
        const user = await requireUser();
        if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

        const { id } = await params;

        const body = await req.json();
        const parsed = updateTaskSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json(
              { error: getFirstZodError(parsed.error) },
              { status: 400 }
            );
          }

        const bodyData = parsed.data;
        const data: Record<string, unknown> = {};

        if (typeof bodyData.title === "string") {
            data.title = bodyData.title;
        }

        if (bodyData.difficulty) {
            data.difficulty = bodyData.difficulty;
        }

        if ("dueDate" in bodyData) {
            if (bodyData.dueDate) {
                const parsedDate = new Date(bodyData.dueDate);

                if (Number.isNaN(parsedDate.getTime())) {
                    return NextResponse.json({ error: "dueDate inválida" }, { status: 400 });
                }

                data.dueDate = parsedDate;
            } else {
                data.dueDate = null;
            }
        }

        if (typeof bodyData.completed === "boolean") {
            data.completed = bodyData.completed;
            data.completedAt = bodyData.completed ? new Date() : null;
        }

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