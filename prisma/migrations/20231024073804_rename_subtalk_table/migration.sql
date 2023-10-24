/*
  Warnings:

  - You are about to drop the column `subredditId` on the `Post` table. All the data in the column will be lost.
  - The primary key for the `Subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subredditId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the `Subreddit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subtalkId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtalkId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "subredditId",
ADD COLUMN     "subtalkId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_pkey",
DROP COLUMN "subredditId",
ADD COLUMN     "subtalkId" TEXT NOT NULL,
ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("userId", "subtalkId");

-- DropTable
DROP TABLE "Subreddit";

-- CreateTable
CREATE TABLE "Subtalk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" TEXT,

    CONSTRAINT "Subtalk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subtalk_name_key" ON "Subtalk"("name");

-- CreateIndex
CREATE INDEX "Subtalk_name_idx" ON "Subtalk"("name");
