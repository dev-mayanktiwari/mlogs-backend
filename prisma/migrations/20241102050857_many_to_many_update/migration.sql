/*
  Warnings:

  - You are about to drop the `_BlogCategories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlogCategories" DROP CONSTRAINT "_BlogCategories_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlogCategories" DROP CONSTRAINT "_BlogCategories_B_fkey";

-- DropTable
DROP TABLE "_BlogCategories";

-- CreateTable
CREATE TABLE "PostCategories" (
    "postId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "PostCategories_pkey" PRIMARY KEY ("postId","categoryId")
);

-- AddForeignKey
ALTER TABLE "PostCategories" ADD CONSTRAINT "PostCategories_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("postId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCategories" ADD CONSTRAINT "PostCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
