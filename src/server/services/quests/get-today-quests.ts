import { ensureTodayQuests } from "@/server/game/quests/quests";

export async function getTodayQuests(userId: string) {
  return ensureTodayQuests(userId);
}

