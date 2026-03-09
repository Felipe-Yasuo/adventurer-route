import { prisma } from "@/lib/db/prisma";
import { dateKeyInTz, diffDaysByDateKey, todayKey } from "@/server/game/time/time";

type InactivityTransactionClient = {
    user: typeof prisma.user;
};

const TZ = "America/Sao_Paulo";
const INACTIVITY_DAMAGE = 3;

export async function applyInactivityPenalty(userId: string) {
    const now = new Date();
    const today = todayKey(TZ);

    return prisma.$transaction(async (tx: InactivityTransactionClient) => {
        const user = await tx.user.findUnique({
            where: { id: userId },
            select: {
                life: true,
                streakCount: true,
                lastCompletionDate: true,
                lastInactivityPenaltyAt: true,
            },
        });

        if (!user) return { applied: false, missedDays: 0, damage: 0 };

        if (user.lastInactivityPenaltyAt) {
            const lastPenaltyDay = dateKeyInTz(user.lastInactivityPenaltyAt, TZ);
            if (lastPenaltyDay === today) {
                return { applied: false, missedDays: 0, damage: 0 };
            }
        }

        if (!user.lastCompletionDate) {
            return { applied: false, missedDays: 0, damage: 0 };
        }

        const lastDay = dateKeyInTz(user.lastCompletionDate, TZ);
        const diffDays = diffDaysByDateKey(lastDay, today);

        if (diffDays <= 1) {
            return { applied: false, missedDays: 0, damage: 0 };
        }

        const missedDays = diffDays - 1;
        const newLife = Math.max(0, user.life - INACTIVITY_DAMAGE);

        await tx.user.update({
            where: { id: userId },
            data: {
                life: newLife,
                streakCount: 0,
                lastInactivityPenaltyAt: now,
            },
        });

        return { applied: true, missedDays, damage: INACTIVITY_DAMAGE };
    });
}
