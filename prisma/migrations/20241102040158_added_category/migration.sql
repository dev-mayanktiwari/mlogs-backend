-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlogCategories_AB_unique" ON "_BlogCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogCategories_B_index" ON "_BlogCategories"("B");

-- AddForeignKey
ALTER TABLE "_BlogCategories" ADD CONSTRAINT "_BlogCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogCategories" ADD CONSTRAINT "_BlogCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("postId") ON DELETE CASCADE ON UPDATE CASCADE;
