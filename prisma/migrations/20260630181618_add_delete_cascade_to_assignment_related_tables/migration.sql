-- DropForeignKey
ALTER TABLE "assignment_files" DROP CONSTRAINT "assignment_files_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "assignments_deliveries" DROP CONSTRAINT "assignments_deliveries_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "delivery_files" DROP CONSTRAINT "delivery_files_deliveryId_fkey";

-- AddForeignKey
ALTER TABLE "assignment_files" ADD CONSTRAINT "assignment_files_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignments_deliveries" ADD CONSTRAINT "assignments_deliveries_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "delivery_files" ADD CONSTRAINT "delivery_files_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "assignments_deliveries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
