-- CreateTable
CREATE TABLE "admins_emails" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "admins_emails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_emails_email_key" ON "admins_emails"("email");
