/*
  Warnings:

  - A unique constraint covering the columns `[userId,code,weekKey]` on the table `Quest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "QuestType" ADD VALUE 'WEEKLY';

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "weekKey" TEXT,
ALTER COLUMN "dayKey" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Quest_userId_weekKey_idx" ON "Quest"("userId", "weekKey");

-- CreateIndex
CREATE UNIQUE INDEX "Quest_userId_code_weekKey_key" ON "Quest"("userId", "code", "weekKey");
