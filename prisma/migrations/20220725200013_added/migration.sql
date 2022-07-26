/*
  Warnings:

  - Added the required column `companyName` to the `EmployerProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployerProfile" ADD COLUMN     "companyName" TEXT NOT NULL;
