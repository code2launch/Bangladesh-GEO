-- CreateTable
CREATE TABLE "divisions" (
    "id" SERIAL NOT NULL,
    "bbsCode" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "geometry" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" SERIAL NOT NULL,
    "bbsCode" TEXT NOT NULL,
    "divisionId" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "geometry" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upazilas" (
    "id" SERIAL NOT NULL,
    "bbsCode" TEXT NOT NULL,
    "districtId" INTEGER NOT NULL,
    "divisionId" INTEGER NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameBn" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "geometry" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upazilas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postOffices" (
    "id" SERIAL NOT NULL,
    "divisionId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "upazilaId" INTEGER,
    "upazilaName" TEXT,
    "nameEn" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "latitude" DECIMAL(65,30),
    "longitude" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "postOffices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "divisions_bbsCode_key" ON "divisions"("bbsCode");

-- CreateIndex
CREATE UNIQUE INDEX "districts_bbsCode_key" ON "districts"("bbsCode");

-- CreateIndex
CREATE INDEX "districts_divisionId_idx" ON "districts"("divisionId");

-- CreateIndex
CREATE UNIQUE INDEX "upazilas_bbsCode_key" ON "upazilas"("bbsCode");

-- CreateIndex
CREATE INDEX "upazilas_districtId_idx" ON "upazilas"("districtId");

-- CreateIndex
CREATE INDEX "upazilas_divisionId_idx" ON "upazilas"("divisionId");

-- CreateIndex
CREATE INDEX "postOffices_postCode_idx" ON "postOffices"("postCode");

-- CreateIndex
CREATE INDEX "postOffices_districtId_idx" ON "postOffices"("districtId");

-- CreateIndex
CREATE INDEX "postOffices_divisionId_idx" ON "postOffices"("divisionId");

-- CreateIndex
CREATE INDEX "postOffices_upazilaId_idx" ON "postOffices"("upazilaId");

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upazilas" ADD CONSTRAINT "upazilas_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upazilas" ADD CONSTRAINT "upazilas_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postOffices" ADD CONSTRAINT "postOffices_divisionId_fkey" FOREIGN KEY ("divisionId") REFERENCES "divisions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postOffices" ADD CONSTRAINT "postOffices_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postOffices" ADD CONSTRAINT "postOffices_upazilaId_fkey" FOREIGN KEY ("upazilaId") REFERENCES "upazilas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
