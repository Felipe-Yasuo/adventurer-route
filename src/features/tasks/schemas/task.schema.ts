import { z } from "zod";

export const difficultySchema = z.enum(["EASY", "MEDIUM", "HARD"]);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "O título é obrigatório.")
    .max(120, "O título deve ter no máximo 120 caracteres."),

  difficulty: difficultySchema.optional(),

  dueDate: z.string().trim().nullable().optional(),

  dayKey: z.string().trim().optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "O título não pode ficar vazio.")
    .max(120, "O título deve ter no máximo 120 caracteres.")
    .optional(),

  difficulty: difficultySchema.optional(),

  dueDate: z.string().trim().nullable().optional(),

  completed: z.boolean().optional(),
});
