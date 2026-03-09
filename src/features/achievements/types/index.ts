export type AchievementApi = {
    id: string;
    code: string;
    title: string;
    description: string | null;
    type: string;
    target: number;
    rewardGold: number;
    rewardXp: number;
    unlocked: boolean;
    unlockedAt: string | null;
};

export type AchievementFilter = "ALL" | "UNLOCKED" | "LOCKED";
