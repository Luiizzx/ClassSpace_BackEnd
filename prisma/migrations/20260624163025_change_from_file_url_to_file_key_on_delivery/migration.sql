/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `delivery_files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "delivery_files" DROP COLUMN "fileUrl",
ADD COLUMN     "fileKey" TEXT;
