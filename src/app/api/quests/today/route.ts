import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";
import { ensureTodayQuests } from "@/lib/game/quests";

export async function GET() {
    try {
        const user = await requireUser();
        if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
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