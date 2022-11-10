/*
  Warnings:

  - The primary key for the `UserDownvotedComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserDownvotedComment` table. All the data in the column will be lost.
  - The primary key for the `UserDownvotedPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserDownvotedPost` table. All the data in the column will be lost.
  - The primary key for the `UserUpvotedComment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserUpvotedComment` table. All the data in the column will be lost.
  - The primary key for the `UserUpvotedPost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserUpvotedPost` table. All the data in the column will be lost.
  - Made the column `userId` on table `UserDownvotedComment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `commentId` on table `UserDownvotedComment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `UserDownvotedPost` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postId` on table `UserDownvotedPost` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `UserUpvotedComment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `commentId` on table `UserUpvotedComment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `UserUpvotedPost` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postId` on table `UserUpvotedPost` required. This step will fail if there are existing NULL values in that column.

*/
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
ALTER TABLE "UserDownvotedComment" DROP CONSTRAINT "UserDownvotedComment_pkey",
DROP COLUMN "id",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "commentId" SET NOT NULL,
ADD CONSTRAINT "UserDownvotedComment_pkey" PRIMARY KEY ("userId", "commentId");

-- AlterTable
ALTER TABLE "UserDownvotedPost" DROP CONSTRAINT "UserDownvotedPost_pkey",
DROP COLUMN "id",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "postId" SET NOT NULL,
ADD CONSTRAINT "UserDownvotedPost_pkey" PRIMARY KEY ("userId", "postId");

-- AlterTable
ALTER TABLE "UserUpvotedComment" DROP CONSTRAINT "UserUpvotedComment_pkey",
DROP COLUMN "id",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "commentId" SET NOT NULL,
ADD CONSTRAINT "UserUpvotedComment_pkey" PRIMARY KEY ("userId", "commentId");

-- AlterTable
ALTER TABLE "UserUpvotedPost" DROP CONSTRAINT "UserUpvotedPost_pkey",
DROP COLUMN "id",
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "postId" SET NOT NULL,
ADD CONSTRAINT "UserUpvotedPost_pkey" PRIMARY KEY ("userId", "postId");

-- AddForeignKey
ALTER TABLE "UserUpvotedComment" ADD CONSTRAINT "UserUpvotedComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpvotedComment" ADD CONSTRAINT "UserUpvotedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDownvotedComment" ADD CONSTRAINT "UserDownvotedComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDownvotedComment" ADD CONSTRAINT "UserDownvotedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpvotedPost" ADD CONSTRAINT "UserUpvotedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUpvotedPost" ADD CONSTRAINT "UserUpvotedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDownvotedPost" ADD CONSTRAINT "UserDownvotedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDownvotedPost" ADD CONSTRAINT "UserDownvotedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
