import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .max(60, "O nome deve ter no máximo 60 caracteres.")
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Digite um email válido."),

  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres.")
    .max(100, "A senha deve ter no máximo 100 caracteres."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Digite um email válido."),

  password: z
    .string()
    .min(1, "A senha é obrigatória."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;