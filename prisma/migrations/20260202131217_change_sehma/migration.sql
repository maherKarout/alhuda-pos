/*
  Warnings:

  - You are about to drop the column `syncStatus` on the `LocalOrderItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LocalOrderItem" (
    "orderId" TEXT NOT NULL PRIMARY KEY,
    "productGuid" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "itemNote" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LocalOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LocalOrder" ("orderId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LocalOrderItem" ("createdAt", "itemNote", "orderId", "productGuid", "quantity") SELECT "createdAt", "itemNote", "orderId", "productGuid", "quantity" FROM "LocalOrderItem";
DROP TABLE "LocalOrderItem";
ALTER TABLE "new_LocalOrderItem" RENAME TO "LocalOrderItem";
CREATE INDEX "LocalOrderItem_orderId_idx" ON "LocalOrderItem"("orderId");
CREATE UNIQUE INDEX "LocalOrderItem_orderId_productGuid_key" ON "LocalOrderItem"("orderId", "productGuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
