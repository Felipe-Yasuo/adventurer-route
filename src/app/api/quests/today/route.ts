import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { getTodayQuests } from "@/server/services/quests/get-today-quests";

export async function GET() {
  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const quests = await getTodayQuests(user.id);

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