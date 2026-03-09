import { prisma } from "@/lib/prisma";
import { clampHeal } from "@/server/game/items/heal";

export type UseItemResult =
  | {
      ok: true;
      healed: number;
      user: { id: string; life: number; maxLife: number };
      usedItem: { id: string; name: string; healValue: number };
      remaining: number;
    }
  | { ok: false; status: 400 | 404; error: string };

type InventoryTx = {
  user: typeof prisma.user;
  inventoryItem: typeof prisma.inventoryItem;
};

export async function useItem(userId: string, itemId: string): Promise<UseItemResult> {
  const result = await prisma.$transaction(async (tx: InventoryTx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, life: true, maxLife: true },
    });

    if (!user) {
      return { status: 404 as const, body: { error: "Usuário não encontrado" } };
    }

    const inv = await tx.inventoryItem.findUnique({
      where: { userId_itemId: { userId: user.id, itemId } },
      select: {
        id: true,
        quantity: true,
        item: { select: { id: true, name: true, healValue: true } },
      },
    });

    if (!inv || inv.quantity <= 0) {
      return { status: 400 as const, body: { error: "Você não possui esse item" } };
    }

    if (user.life >= user.maxLife) {
      return { status: 400 as const, body: { error: "Vida já está cheia" } };
    }

    const { newLife, healed } = clampHeal(user.life, user.maxLife, inv.item.healValue);

    await tx.inventoryItem.update({
      where: { id: inv.id },
      data: { quantity: { decrement: 1 } },
    });

    const updatedUser = await tx.user.update({
      where: { id: user.id },
      data: { life: newLife },
      select: { id: true, life: true, maxLife: true },
    });

    return {
      status: 200 as const,
      body: {
        healed,
        user: updatedUser,
        usedItem: { id: inv.item.id, name: inv.item.name, healValue: inv.item.healValue },
        remaining: inv.quantity - 1,
      },
    };
  });

  if (result.status !== 200) {
    return { ok: false, status: result.status, error: result.body.error };
  }

  return { ok: true, ...result.body };
}
