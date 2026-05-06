-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TherapistLanguages" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TherapistLanguages_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_name_key" ON "Language"("name");

-- CreateIndex
CREATE INDEX "_TherapistLanguages_B_index" ON "_TherapistLanguages"("B");

-- AddForeignKey
ALTER TABLE "_TherapistLanguages" ADD CONSTRAINT "_TherapistLanguages_A_fkey" FOREIGN KEY ("A") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TherapistLanguages" ADD CONSTRAINT "_TherapistLanguages_B_fkey" FOREIGN KEY ("B") REFERENCES "Therapist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
