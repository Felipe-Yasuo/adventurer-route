import { NextResponse } from "next/server";
import { requireUser } from "@/lib/requireUser";
import { getInventory } from "@/server/services/inventory/get-inventory";

export async function GET() {
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