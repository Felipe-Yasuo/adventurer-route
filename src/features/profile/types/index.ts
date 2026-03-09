/** Dados do usuário retornados pela API /api/me */
export type MeApi = {
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
    tasksCompletedTotal: number;
};
