/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `assignments_deliveries` table. All the data in the column will be lost.
  - Added the required column `score` to the `assignments_deliveries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assignments_deliveries" DROP COLUMN "fileUrl",
ADD COLUMN     "score" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "delivery_files" (
    "id" SERIAL NOT NULL,
    "deliveryId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,

    CONSTRAINT "delivery_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "delivery_files" ADD CONSTRAINT "delivery_files_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "assignments_deliveries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
