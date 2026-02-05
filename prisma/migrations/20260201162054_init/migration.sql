-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "barCode" TEXT,
    "branchMask" TEXT NOT NULL,
    "category" TEXT,
    "color" TEXT,
    "company" TEXT,
    "model" TEXT,
    "origin" TEXT,
    "provenance" TEXT,
    "quality" TEXT,
    "unity" TEXT,
    "dim" TEXT,
    "currencyGuid" TEXT,
    "individualPrice" REAL NOT NULL,
    "wholesalePrice" REAL NOT NULL,
    "openPrice" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");
