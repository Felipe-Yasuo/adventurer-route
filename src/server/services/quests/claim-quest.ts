import { claimQuest as libClaimQuest } from "@/server/game/quests/quests";

export async function claimQuest(userId: string, questId: string) {
  return libClaimQuest(userId, questId);
}

