/*
  Warnings:

  - Made the column `fileKey` on table `delivery_files` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "delivery_files" ALTER COLUMN "fileKey" SET NOT NULL,
ALTER COLUMN "fileKey" SET DEFAULT '';
