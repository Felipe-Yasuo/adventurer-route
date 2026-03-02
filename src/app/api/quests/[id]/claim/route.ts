import { NextResponse } from "next/server";
import { getDevUser } from "@/lib/devUser";
import { claimQuest } from "@/lib/game/quests";

export async function POST(
    _req: Request,
    ctx: { params: { id: string } }
) {
    try {
        const user = await getDevUser();
        const questId = ctx.params.id;

        const result = await claimQuest(user.id, questId);

        return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
    } catch (e: any) {
        const msg = e?.message ?? "Erro ao resgatar quest";

        const status =
            msg.includes("não encontrada") ? 404 :
                msg.includes("já foi resgatada") ? 400 :
                    msg.includes("ainda não foi completada") ? 400 :
                        msg.includes("Usuário não encontrado") ? 404 :
                            500;

        return NextResponse.json({ error: msg }, { status });
    }
}