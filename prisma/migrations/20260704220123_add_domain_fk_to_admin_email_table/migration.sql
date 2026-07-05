/*
  Warnings:

  - Added the required column `domainId` to the `admins_emails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins_emails" ADD COLUMN     "domainId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "admins_emails" ADD CONSTRAINT "admins_emails_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
