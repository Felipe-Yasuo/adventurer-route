import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const limited = await checkRateLimit(req, "public");
  if (limited) return limited;
    try {
        const items = await prisma.item.findMany({
            orderBy: { price: "asc" },
            select: { id: true, type: true, name: true, price: true, healValue: true },
        });

        return NextResponse.json(items);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao listar loja" }, { status: 500 });
    }
}