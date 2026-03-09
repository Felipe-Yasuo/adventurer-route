import { claimQuest as libClaimQuest } from "@/lib/game/quests";

export async function claimQuest(userId: string, questId: string) {
  return libClaimQuest(userId, questId);
}
