/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `PasswordRecovery` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PasswordRecovery_userId_key" ON "PasswordRecovery"("userId");
