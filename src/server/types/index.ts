/**
 * Tipos compartilhados de resposta de API para o backend.
 * Use esses tipos para garantir consistência entre services e routes.
 */
import type { Quest } from "@prisma/client";

// Re-exporta para uso conveniente
export type { Quest };

/** Retorno padrão de user com campos de jogo */
export type UserGameSnapshot = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    level: number;
    xp: number;
    gold: number;
    life: number;
    maxLife: number;
    streakCount: number;
    lastCompletionDate: Date | null;
    tasksCompletedTotal: number;
};

/** Retorno resumido de user (só campos de progressão) */
export type UserProgressSnapshot = {
    id: string;
    level: number;
    xp: number;
    gold: number;
    life: number;
    maxLife: number;
    streakCount: number;
    lastCompletionDate: Date | null;
};

/** Alias para o tipo Quest do Prisma, para uso nos contracts de API */
export type QuestApiRecord = Quest;

/** Resultado de reivindicar (claim) uma quest */
export type QuestClaimResult = {
    quest: QuestApiRecord;
    rewards: { xp: number; gold: number };
    leveledUp: number;
    user: UserGameSnapshot;
};

