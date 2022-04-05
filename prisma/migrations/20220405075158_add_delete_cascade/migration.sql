-- DropForeignKey
ALTER TABLE "option" DROP CONSTRAINT "option_pollId_fkey";

-- DropForeignKey
ALTER TABLE "poll" DROP CONSTRAINT "poll_authorId_fkey";

-- AddForeignKey
ALTER TABLE "poll" ADD CONSTRAINT "poll_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE CASCADE ON UPDATE CASCADE;
