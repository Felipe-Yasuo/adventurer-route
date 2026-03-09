import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";
import { getMe } from "@/server/services/user/get-me";

export async function GET() {
  try {
    const u = await requireUser();
    if (!u) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const result = await getMe(u.id);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { ok: _ok, ...body } = result;
    return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
  }
}