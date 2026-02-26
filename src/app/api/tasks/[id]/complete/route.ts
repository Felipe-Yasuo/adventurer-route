import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDevUser } from "@/lib/devUser";

function rewardsByDifficulty(difficulty: "EASY" | "MEDIUM" | "HARD") {
    if (difficulty === "EASY") return { xp: 10, gold: 5 };
    if (difficulty === "MEDIUM") return { xp: 20, gold: 10 };
    return { xp: 35, gold: 20 };
}

function xpToNextLevel(level: number) {
    return 100 + (level - 1) * 25;
}

export async function PATCH(_: Request, { params }: { params: Promise<{ id: string }> }) {
    try {

        const user = await getDevUser();
        const { id: taskId } = await params;

        const result = await prisma.$transaction(async (tx) => {
            const task = await tx.task.findFirst({
                where: { id: taskId, userId: user.id },
            });

            if (!task) {
                return { status: 404 as const, body: { error: "Task não encontrada" } };
            }

            if (task.completed) {
                return { status: 400 as const, body: { error: "Task já concluída" } };
            }

            const r = rewardsByDifficulty(task.difficulty);

            const updatedTask = await tx.task.update({
                where: { id: taskId },
                data: {
                    completed: true,
                    completedAt: new Date(),
                },
            });

            let updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    xp: { increment: r.xp },
                    gold: { increment: r.gold },
                },
            });

            while (updatedUser.xp >= xpToNextLevel(updatedUser.level)) {
                updatedUser = await tx.user.update({
                    where: { id: user.id },
                    data: {
                        level: { increment: 1 },
                    },
                });
            }

            return {
                status: 200 as const,
                body: {
                    task: updatedTask,
                    rewards: r,
                    user: {
                        id: updatedUser.id,
                        level: updatedUser.level,
                        xp: updatedUser.xp,
                        life: updatedUser.life,
                        maxLife: updatedUser.maxLife,
                        gold: updatedUser.gold,
                    },
                },
            };
        });

        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao concluir task" }, { status: 500 });
    }
}