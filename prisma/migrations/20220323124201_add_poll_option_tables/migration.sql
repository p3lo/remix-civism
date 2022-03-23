/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "picture" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll" (
    "id" SERIAL NOT NULL,
    "poll" TEXT NOT NULL,
    "poll_description" TEXT,
    "slug" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "id" SERIAL NOT NULL,
    "option" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "pollId" INTEGER NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "poll" ADD CONSTRAINT "poll_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
