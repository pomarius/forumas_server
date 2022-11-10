/*
  Warnings:

  - You are about to drop the column `userId` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the `UserDownvotedComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDownvotedPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserUpvotedComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserUpvotedPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserDownvotedComment" DROP CONSTRAINT "UserDownvotedComment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "UserDownvotedComment" DROP CONSTRAINT "UserDownvotedComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserDownvotedPost" DROP CONSTRAINT "UserDownvotedPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "UserDownvotedPost" DROP CONSTRAINT "UserDownvotedPost_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserUpvotedComment" DROP CONSTRAINT "UserUpvotedComment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "UserUpvotedComment" DROP CONSTRAINT "UserUpvotedComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserUpvotedPost" DROP CONSTRAINT "UserUpvotedPost_postId_fkey";

-- DropForeignKey
ALTER TABLE "UserUpvotedPost" DROP CONSTRAINT "UserUpvotedPost_userId_fkey";

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "userId";

-- DropTable
DROP TABLE "UserDownvotedComment";

-- DropTable
DROP TABLE "UserDownvotedPost";

-- DropTable
DROP TABLE "UserUpvotedComment";

-- DropTable
DROP TABLE "UserUpvotedPost";

-- CreateTable
CREATE TABLE "commentUpvotes" (
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "commentUpvotes_pkey" PRIMARY KEY ("userId","commentId")
);

-- CreateTable
CREATE TABLE "commentDownvotes" (
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,

    CONSTRAINT "commentDownvotes_pkey" PRIMARY KEY ("userId","commentId")
);

-- CreateTable
CREATE TABLE "postUpvotes" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "postUpvotes_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateTable
CREATE TABLE "postDownvotes" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "postDownvotes_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateTable
CREATE TABLE "TopicModerator" (
    "userId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "TopicModerator_pkey" PRIMARY KEY ("userId","topicId")
);

-- AddForeignKey
ALTER TABLE "commentUpvotes" ADD CONSTRAINT "commentUpvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentUpvotes" ADD CONSTRAINT "commentUpvotes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentDownvotes" ADD CONSTRAINT "commentDownvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentDownvotes" ADD CONSTRAINT "commentDownvotes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postUpvotes" ADD CONSTRAINT "postUpvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postUpvotes" ADD CONSTRAINT "postUpvotes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postDownvotes" ADD CONSTRAINT "postDownvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postDownvotes" ADD CONSTRAINT "postDownvotes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicModerator" ADD CONSTRAINT "TopicModerator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicModerator" ADD CONSTRAINT "TopicModerator_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
