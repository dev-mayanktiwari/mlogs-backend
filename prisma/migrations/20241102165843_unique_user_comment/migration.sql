/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comment_userId_postId_key" ON "Comment"("userId", "postId");
