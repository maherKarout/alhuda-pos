/*
  Warnings:

  - The primary key for the `LocalOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LocalOrder` table. All the data in the column will be lost.
  - The primary key for the `LocalOrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LocalOrder" (
    "orderId" TEXT NOT NULL PRIMARY KEY,
    "totalPrice" REAL NOT NULL,
    "orderDiscount" REAL NOT NULL DEFAULT 0,
    "approximationDiscountValue" REAL,
    "customerOrderId" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customer" TEXT NOT NULL
);
INSERT INTO "new_LocalOrder" ("approximationDiscountValue", "currency", "customer", "orderDiscount", "orderId", "paymentMethod", "status", "totalPrice") SELECT "approximationDiscountValue", "currency", "customer", "orderDiscount", "orderId", "paymentMethod", "status", "totalPrice" FROM "LocalOrder";
DROP TABLE "LocalOrder";
ALTER TABLE "new_LocalOrder" RENAME TO "LocalOrder";
CREATE INDEX "LocalOrder_orderId_idx" ON "LocalOrder"("orderId");
CREATE TABLE "new_LocalOrderItem" (
    "orderId" TEXT NOT NULL,
    "productGuid" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "itemNote" TEXT,
    "syncStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("orderId", "productGuid"),
    CONSTRAINT "LocalOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LocalOrder" ("orderId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_LocalOrderItem" ("createdAt", "itemNote", "orderId", "productGuid", "quantity") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "itemNote", "orderId", "productGuid", "quantity" FROM "LocalOrderItem";
DROP TABLE "LocalOrderItem";
ALTER TABLE "new_LocalOrderItem" RENAME TO "LocalOrderItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
