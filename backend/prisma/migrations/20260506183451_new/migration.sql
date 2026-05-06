/*
  Warnings:

  - You are about to drop the `Specialty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TherapistSpecialties` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gender` to the `Therapist` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TherapistSpecialties" DROP CONSTRAINT "_TherapistSpecialties_A_fkey";

-- DropForeignKey
ALTER TABLE "_TherapistSpecialties" DROP CONSTRAINT "_TherapistSpecialties_B_fkey";

-- AlterTable
ALTER TABLE "Therapist" ADD COLUMN     "gender" TEXT;

-- Set default gender for existing rows
UPDATE "Therapist" SET "gender" = 'Prefer not to say' WHERE "gender" IS NULL;

-- Now make it NOT NULL
ALTER TABLE "Therapist" ALTER COLUMN "gender" SET NOT NULL;

-- DropTable
DROP TABLE "Specialty";

-- DropTable
DROP TABLE "_TherapistSpecialties";

-- CreateTable
CREATE TABLE "Concerns" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Concerns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TherapistConcerns" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TherapistConcerns_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_TherapistSessionTypes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TherapistSessionTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Concerns_name_key" ON "Concerns"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SessionType_name_key" ON "SessionType"("name");

-- CreateIndex
CREATE INDEX "_TherapistConcerns_B_index" ON "_TherapistConcerns"("B");

-- CreateIndex
CREATE INDEX "_TherapistSessionTypes_B_index" ON "_TherapistSessionTypes"("B");

-- AddForeignKey
ALTER TABLE "_TherapistConcerns" ADD CONSTRAINT "_TherapistConcerns_A_fkey" FOREIGN KEY ("A") REFERENCES "Concerns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TherapistConcerns" ADD CONSTRAINT "_TherapistConcerns_B_fkey" FOREIGN KEY ("B") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TherapistSessionTypes" ADD CONSTRAINT "_TherapistSessionTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "SessionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TherapistSessionTypes" ADD CONSTRAINT "_TherapistSessionTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
