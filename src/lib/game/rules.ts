export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export function rewardsByDifficulty(difficulty: Difficulty) {
    switch (difficulty) {
        case "EASY":
            return { xp: 10, gold: 5 };
        case "MEDIUM":
            return { xp: 20, gold: 10 };
        case "HARD":
            return { xp: 35, gold: 20 };
        default:
            return { xp: 10, gold: 5 };
    }
}

export function xpToNextLevel(level: number) {
    return 100 + (level - 1) * 25;
}