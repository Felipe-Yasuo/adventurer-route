import { NextResponse } from "next/server";
import { getDevUser } from "@/lib/devUser";
import { ensureTodayQuests } from "@/lib/game/quests";

export async function GET() {
    try {
        const user = await getDevUser();
        const quests = await ensureTodayQuests(user.id);

        return NextResponse.json(
            { quests },
            { headers: { "Cache-Control": "no-store" } }
        );
    } catch (e: any) {
        return NextResponse.json(
            { error: e?.message ?? "Erro ao carregar quests de hoje" },
            { status: 500 }
        );
    }
}