import { prisma } from "@/lib/db/prisma";

export type BuyItemInput = {
  itemId: string;
  quantity: number;
};

export type BuyItemResult =
  | {
      ok: true;
      user: { id: string; gold: number };
      inventoryItem: {
        id: string;
        quantity: number;
        item: { id: string; name: string; type: string; healValue: number; price: number };
      };
      totalCost: number;
    }
  | { ok: false; status: 400 | 404; error: string; gold?: number; totalCost?: number };

type ShopTx = {
  user: typeof prisma.user;
  item: typeof prisma.item;
  inventoryItem: typeof prisma.inventoryItem;
};

export async function buyItem(userId: string, input: BuyItemInput): Promise<BuyItemResult> {
  const { itemId, quantity } = input;

  const result = await prisma.$transaction(async (tx: ShopTx) => {
    const dbUser = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, gold: true },
    });

    const item = await tx.item.findUnique({
      where: { id: itemId },
      select: { id: true, name: true, price: true, healValue: true, type: true },
    });

    if (!dbUser) {
      return { status: 404 as const, body: { error: "Usuário não encontrado" } };
    }

    if (!item) {
      return { status: 404 as const, body: { error: "Item não encontrado" } };
    }

    const totalCost = item.price * quantity;

    if (dbUser.gold < totalCost) {
      return {
        status: 400 as const,
        body: { error: "Gold insuficiente", gold: dbUser.gold, totalCost },
      };
    }

    const updatedUser = await tx.user.update({
      where: { id: dbUser.id },
      data: { gold: { decrement: totalCost } },
      select: { id: true, gold: true },
    });

    const inv = await tx.inventoryItem.upsert({
      where: { userId_itemId: { userId: dbUser.id, itemId: item.id } },
      update: { quantity: { increment: quantity } },
      create: { userId: dbUser.id, itemId: item.id, quantity },
      select: {
        id: true,
        quantity: true,
        item: { select: { id: true, name: true, type: true, healValue: true, price: true } },
      },
    });

    return {
      status: 200 as const,
      body: { user: updatedUser, inventoryItem: inv, totalCost },
    };
  });

  if (result.status !== 200) {
    return { ok: false, status: result.status, ...result.body };
  }

  return { ok: true, ...result.body };
}
