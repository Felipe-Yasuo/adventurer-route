import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/require-user";
import { useItemSchema } from "@/features/shop/schemas/shop.schema";
import { getFirstZodError } from "@/lib/http/get-first-zod-error";
import { useItem } from "@/server/services/inventory/use-item";

export async function POST(req: Request) {
  try {
    const me = await requireUser();
    if (!me) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const body = await req.json();
    const parsed = useItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: getFirstZodError(parsed.error) }, { status: 400 });
    }

    const { itemId } = parsed.data;
    const result = await useItem(me.id, itemId);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    const { ok: _ok, ...body2 } = result;
    return NextResponse.json(body2);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao usar item" }, { status: 500 });
  }
}