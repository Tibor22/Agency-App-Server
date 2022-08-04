/*
  Warnings:

  - You are about to drop the column `userId` on the `JobPost` table. All the data in the column will be lost.
  - Added the required column `employerProfileId` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "JobPost" DROP CONSTRAINT "JobPost_userId_fkey";

-- AlterTable
ALTER TABLE "JobPost" DROP COLUMN "userId",
ADD COLUMN     "employerProfileId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "JobPost" ADD CONSTRAINT "JobPost_employerProfileId_fkey" FOREIGN KEY ("employerProfileId") REFERENCES "EmployerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
