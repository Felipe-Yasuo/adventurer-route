import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDevUser } from "@/lib/devUser";
import { rewardsByDifficulty } from "@/lib/game/rules";
import { applyXpAndLevelUp } from "@/lib/game/progression";

export async function PATCH(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

            const rewards = rewardsByDifficulty(task.difficulty);

            const updatedTask = await tx.task.update({
                where: { id: taskId },
                data: { completed: true, completedAt: new Date() },
            });

            const currentUser = await tx.user.findUnique({
                where: { id: user.id },
                select: { id: true, level: true, xp: true, gold: true, life: true, maxLife: true },
            });

            if (!currentUser) {
                return { status: 404 as const, body: { error: "Usuário não encontrado" } };
            }

            const progressed = applyXpAndLevelUp(
                { level: currentUser.level, xp: currentUser.xp },
                rewards.xp
            );


            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    xp: progressed.xp,
                    level: progressed.level,
                    gold: { increment: rewards.gold },
                },
                select: {
                    id: true,
                    level: true,
                    xp: true,
                    life: true,
                    maxLife: true,
                    gold: true,
                },
            });

            return {
                status: 200 as const,
                body: {
                    task: updatedTask,
                    rewards,
                    leveledUp: progressed.leveledUp,
                    user: updatedUser,
                },
            };
        });

        return NextResponse.json(result.body, { status: result.status });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao concluir task" }, { status: 500 });
    }
}

