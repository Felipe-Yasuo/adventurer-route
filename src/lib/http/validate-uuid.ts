import { z } from "zod";
import { NextResponse } from "next/server";

const idSchema = z.string().min(1, "ID inválido.").max(128, "ID inválido.");

export function validateId(id: string): { error: NextResponse } | { id: string } {
  const parsed = idSchema.safeParse(id);
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

/** @deprecated use validateId */
export const validateUuid = validateId;
