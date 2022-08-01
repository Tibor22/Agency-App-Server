/*
  Warnings:

  - You are about to drop the column `title` on the `JobPost` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `JobPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeFrame` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "title",
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "timeFrame" TEXT NOT NULL;
