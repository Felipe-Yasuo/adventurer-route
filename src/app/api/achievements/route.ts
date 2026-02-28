import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDevUser } from "@/lib/devUser";

export async function GET() {
  try {
    const user = await getDevUser();

    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        code: true,
        title: true,
        description: true,
        type: true,
        target: true,
        rewardGold: true,
        rewardXp: true,
        users: {
          where: { userId: user.id },
          select: { unlockedAt: true },
        },
      },
    });

    const mapped = achievements.map((a) => ({
      id: a.id,
      code: a.code,
      title: a.title,
      description: a.description,
      type: a.type,
      target: a.target,
      rewardGold: a.rewardGold,
      rewardXp: a.rewardXp,
      unlockedAt: a.users[0]?.unlockedAt ?? null,
      unlocked: a.users.length > 0,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao listar conquistas" }, { status: 500 });
  }
}