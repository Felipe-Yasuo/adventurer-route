import { xpToNextLevel } from "./rules";

export type PlayerState = {
    level: number;
    xp: number;
};

export type Reward = {
    xp: number;
    gold: number;
};

export function applyXpAndLevelUp(state: PlayerState, rewardXp: number) {
    let level = state.level;
    let xp = state.xp + rewardXp;
    let leveledUp = 0;

    while (xp >= xpToNextLevel(level)) {
        level += 1;
        leveledUp += 1;
    }

    return { level, xp, leveledUp };
}