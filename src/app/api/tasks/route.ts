import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDevUser } from "@/lib/devUser";
import { Difficulty } from "@prisma/client";

export async function GET() {
    try {
        const user = await getDevUser();

        const tasks = await prisma.task.findMany({
            where: { userId: user.id },
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
        const user = await getDevUser();
        const body = (await req.json()) as {
            title?: string;
            difficulty?: Difficulty;
            dueDate?: string | null;
        };

        const title = (body.title ?? "").trim();
        if (!title) {
            return NextResponse.json({ error: "title é obrigatório" }, { status: 400 });
        }

        const difficulty = body.difficulty ?? "EASY";

        const task = await prisma.task.create({
            data: {
                title,
                difficulty,
                dueDate: body.dueDate ? new Date(body.dueDate) : null,
                userId: user.id,
            },
        });

        return NextResponse.json(task, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao criar task" }, { status: 500 });
    }
}