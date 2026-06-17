/*
  Warnings:

  - Added the required column `delivered` to the `assignments_deliveries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assignments_deliveries" ADD COLUMN     "delivered" BOOLEAN NOT NULL;
