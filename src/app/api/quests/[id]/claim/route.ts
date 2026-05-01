import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { claimQuest } from "@/server/services/quests/claim-quest";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateUuid } from "@/lib/http/validate-uuid";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const limited = await checkRateLimit(req, "write");
  if (limited) return limited;

  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const rawId = (await params).id;
    const validated = validateUuid(rawId);
    if ("error" in validated) return validated.error;
    const { id: questId } = validated;
    const result = await claimQuest(user.id, questId);

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
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