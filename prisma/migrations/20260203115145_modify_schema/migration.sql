/*
  Warnings:

  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "customers";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cuGuid" TEXT,
    "accGuid" TEXT,
    "balance" REAL NOT NULL DEFAULT 0,
    "totalPurchases" REAL NOT NULL,
    "cuMobile" TEXT,
    "cuPhone1" TEXT,
    "cuPhone2" TEXT,
    "cuStreet" TEXT,
    "cuDistrict" TEXT,
    "cuArea" TEXT,
    "cuCity" TEXT,
    "cuCountry" TEXT,
    "accParentGuid" TEXT,
    "branch" TEXT,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "numberOfInvoices" INTEGER NOT NULL DEFAULT 0,
    "lastInvoices" DATETIME,
    "isSync" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerId_key" ON "Customer"("customerId");
