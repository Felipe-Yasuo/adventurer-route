import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { getInventory } from "@/server/services/inventory/get-inventory";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const limited = await checkRateLimit(req, "read");
  if (limited) return limited;

  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const inventory = await getInventory(user.id);
    return NextResponse.json(inventory);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao listar inventário" }, { status: 500 });
  }
}