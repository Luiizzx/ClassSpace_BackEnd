-- CreateTable
CREATE TABLE "post_files" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,

    CONSTRAINT "post_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "post_files" ADD CONSTRAINT "post_files_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
