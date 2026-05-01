import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { buyItemSchema } from "@/features/shop/schemas/shop.schema";
import { getFirstZodError } from "@/lib/http/get-first-zod-error";
import { buyItem } from "@/server/services/shop/buy-item";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, "write");
  if (limited) return limited;

  try {
    const user = await requireUser();
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = buyItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: getFirstZodError(parsed.error) }, { status: 400 });
    }

    const { itemId, quantity: rawQty } = parsed.data;
    const quantity = Math.max(1, Number(rawQty ?? 1));

    const result = await buyItem(user.id, { itemId, quantity });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, ...(result.gold !== undefined && { gold: result.gold, totalCost: result.totalCost }) },
        { status: result.status }
      );
    }

    const { ok: _ok, ...body2 } = result;
    return NextResponse.json(body2, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao comprar item" }, { status: 500 });
  }
}