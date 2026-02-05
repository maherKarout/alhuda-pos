-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cuGuid" TEXT,
    "accGuid" TEXT,
    "balance" REAL DEFAULT 0,
    "totalPurchases" REAL DEFAULT 0,
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
    "customerId" TEXT,
    "name" TEXT NOT NULL,
    "numberOfInvoices" INTEGER NOT NULL DEFAULT 0,
    "lastInvoices" DATETIME,
    "isSync" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Customer" ("accGuid", "accParentGuid", "balance", "branch", "createdAt", "cuArea", "cuCity", "cuCountry", "cuDistrict", "cuGuid", "cuMobile", "cuPhone1", "cuPhone2", "cuStreet", "customerId", "id", "isSync", "lastInvoices", "name", "numberOfInvoices", "totalPurchases", "updatedAt") SELECT "accGuid", "accParentGuid", "balance", "branch", "createdAt", "cuArea", "cuCity", "cuCountry", "cuDistrict", "cuGuid", "cuMobile", "cuPhone1", "cuPhone2", "cuStreet", "customerId", "id", "isSync", "lastInvoices", "name", "numberOfInvoices", "totalPurchases", "updatedAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_customerId_key" ON "Customer"("customerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
