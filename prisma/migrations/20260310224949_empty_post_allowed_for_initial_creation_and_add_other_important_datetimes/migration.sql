/*
  Warnings:

  - You are about to drop the column `postedAt` on the `Post` table. All the data in the column will be lost.
  - Added the required column `lastModifiedAt` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishedAt` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "postedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "lastModifiedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "text" DROP NOT NULL;
