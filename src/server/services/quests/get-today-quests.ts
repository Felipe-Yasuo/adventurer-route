import { ensureTodayQuests } from "@/lib/game/quests";

export async function getTodayQuests(userId: string) {
  return ensureTodayQuests(userId);
}
