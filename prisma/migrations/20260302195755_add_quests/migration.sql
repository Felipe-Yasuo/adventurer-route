-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('DAILY');

-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('ACTIVE', 'CLAIMED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "QuestType" NOT NULL,
    "status" "QuestStatus" NOT NULL DEFAULT 'ACTIVE',
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "rewardXp" INTEGER NOT NULL DEFAULT 0,
    "rewardGold" INTEGER NOT NULL DEFAULT 0,
    "dayKey" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quest_userId_dayKey_idx" ON "Quest"("userId", "dayKey");

-- CreateIndex
CREATE UNIQUE INDEX "Quest_userId_code_dayKey_key" ON "Quest"("userId", "code", "dayKey");

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
