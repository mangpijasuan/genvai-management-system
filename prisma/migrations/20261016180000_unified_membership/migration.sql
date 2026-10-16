ALTER TABLE "Application" ADD COLUMN "applicationType" TEXT NOT NULL DEFAULT 'INDIVIDUAL';
CREATE TABLE "FamilyAdditionApplicant" (
 "id" TEXT NOT NULL,
 "applicationId" TEXT NOT NULL,
 "fullName" TEXT NOT NULL,
 "relationship" TEXT NOT NULL,
 "dateOfBirth" TIMESTAMP(3),
 "proposedPaymentCents" INTEGER,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT "FamilyAdditionApplicant_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "FamilyAdditionApplicant_applicationId_idx" ON "FamilyAdditionApplicant"("applicationId");
ALTER TABLE "FamilyAdditionApplicant" ADD CONSTRAINT "FamilyAdditionApplicant_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
