export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type DifficultyFilter = "ALL" | "EASY" | "MEDIUM" | "HARD";

export type UserApi = {
    level: number;
    xp: number;
    life: number;
    maxLife: number;
    gold: number;
    streakCount: number;
    avatarUrl?: string | null;
    penalties?: any;
};



export type TaskUI = {
    id: string;
    title: string;
    description?: string | null;
    difficulty: Difficulty;
    dueDate?: string | null; // YYYY-MM-DD
    completed: boolean;
    tags: string[];
};

export type TaskApi = {
    id: string;
    title: string;
    difficulty: Difficulty;
    dueDate: string | null;
    completed: boolean;
    completedAt: string | null;
};

export type CompleteResponse = {
    rewards?: { xp: number; gold: number };
    leveledUp?: number;
    achievements?: {
        unlocked?: Array<{ code: string; title: string; rewardGold: number; rewardXp: number }>;
        totalRewardGold?: number;
        totalRewardXp?: number;
    };
};