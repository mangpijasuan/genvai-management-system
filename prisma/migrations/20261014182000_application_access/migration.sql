-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "accessTokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Application_accessTokenHash_key" ON "Application"("accessTokenHash");
