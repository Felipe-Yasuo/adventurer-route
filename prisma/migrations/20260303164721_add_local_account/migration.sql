-- CreateTable
CREATE TABLE "LocalAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LocalAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalAccount_userId_key" ON "LocalAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalAccount_email_key" ON "LocalAccount"("email");

-- AddForeignKey
ALTER TABLE "LocalAccount" ADD CONSTRAINT "LocalAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
