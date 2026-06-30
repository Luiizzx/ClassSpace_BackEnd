-- CreateTable
CREATE TABLE "assignment_files" (
    "id" SERIAL NOT NULL,
    "assignmentId" INTEGER NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,

    CONSTRAINT "assignment_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "assignment_files" ADD CONSTRAINT "assignment_files_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
