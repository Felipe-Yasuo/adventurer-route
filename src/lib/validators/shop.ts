import { z } from "zod";

export const buyItemSchema = z.object({
  itemId: z.string().min(1, "itemId é obrigatório."),
  quantity: z.number().int().min(1, "A quantidade mínima é 1.").optional(),
});

export const useItemSchema = z.object({
  itemId: z.string().min(1, "itemId é obrigatório."),
});