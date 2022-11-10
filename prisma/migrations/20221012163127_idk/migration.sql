/*
  Warnings:

  - You are about to drop the column `downvotes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Comment` table. All the data in the column will be lost.
  - Added the required column `downvotes` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upvotes` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "downvotes" INTEGER NOT NULL,
ADD COLUMN     "upvotes" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserUpvotedComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "commentId" TEXT,

    CONSTRAINT "UserUpvotedComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDownvotedComment" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "commentId" TEXT,

    CONSTRAINT "UserDownvotedComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUpvotedPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "postId" TEXT,

    CONSTRAINT "UserUpvotedPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDownvotedPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "postId" TEXT,

    CONSTRAINT "UserDownvotedPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserUpvotedComment" ADD CONSTRAINT "UserUpvotedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpvotedComment" ADD CONSTRAINT "UserUpvotedComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDownvotedComment" ADD CONSTRAINT "UserDownvotedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDownvotedComment" ADD CONSTRAINT "UserDownvotedComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpvotedPost" ADD CONSTRAINT "UserUpvotedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpvotedPost" ADD CONSTRAINT "UserUpvotedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDownvotedPost" ADD CONSTRAINT "UserDownvotedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDownvotedPost" ADD CONSTRAINT "UserDownvotedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
