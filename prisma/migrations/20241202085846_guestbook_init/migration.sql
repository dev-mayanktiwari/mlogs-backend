-- CreateTable
CREATE TABLE "GuestBook" (
    "guestBookId" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestBook_pkey" PRIMARY KEY ("guestBookId")
);

-- CreateTable
CREATE TABLE "UserOnGuestBook" (
    "guestbookId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserOnGuestBook_pkey" PRIMARY KEY ("guestbookId","userId")
);

-- AddForeignKey
ALTER TABLE "UserOnGuestBook" ADD CONSTRAINT "UserOnGuestBook_guestbookId_fkey" FOREIGN KEY ("guestbookId") REFERENCES "GuestBook"("guestBookId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnGuestBook" ADD CONSTRAINT "UserOnGuestBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
