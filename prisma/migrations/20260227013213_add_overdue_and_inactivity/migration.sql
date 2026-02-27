-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "overdueProcessedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastInactivityPenaltyAt" TIMESTAMP(3);
