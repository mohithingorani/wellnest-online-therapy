-- CreateTable
CREATE TABLE "TherapyType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TherapistTherapyTypes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TherapistTherapyTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "TherapyType_name_key" ON "TherapyType"("name");

-- CreateIndex
CREATE INDEX "_TherapistTherapyTypes_B_index" ON "_TherapistTherapyTypes"("B");

-- AddForeignKey
ALTER TABLE "_TherapistTherapyTypes" ADD CONSTRAINT "_TherapistTherapyTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TherapistTherapyTypes" ADD CONSTRAINT "_TherapistTherapyTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "TherapyType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
