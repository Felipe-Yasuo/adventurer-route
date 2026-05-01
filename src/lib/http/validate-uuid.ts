import { z } from "zod";
import { NextResponse } from "next/server";

const uuidSchema = z.string().uuid("ID inválido.");

export function validateUuid(id: string): { error: NextResponse } | { id: string } {
  const parsed = uuidSchema.safeParse(id);
  if (!parsed.success) {
    return {
      error: NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ID inválido." },
        { status: 400 }
      ),
    };
  }
  return { id: parsed.data };
}
