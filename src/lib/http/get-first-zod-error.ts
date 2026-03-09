import type { ZodError } from "zod";

export function getFirstZodError(error: ZodError) {
  return error.issues[0]?.message ?? "Dados inválidos.";
}
