/*
  Warnings:

  - A unique constraint covering the columns `[token,code]` on the table `AccountConfirmation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AccountConfirmation_token_code_key" ON "AccountConfirmation"("token", "code");
