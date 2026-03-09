import { prisma } from "@/lib/prisma";

export async function getInventory(userId: string) {
  return prisma.inventoryItem.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      quantity: true,
      item: { select: { id: true, type: true, name: true, price: true, healValue: true } },
    },
  });
}
