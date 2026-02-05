/*
  Warnings:

  - You are about to drop the column `customerOrderId` on the `LocalOrder` table. All the data in the column will be lost.
  - You are about to drop the column `orderGuid` on the `LocalOrder` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LocalOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "totalPrice" REAL NOT NULL,
    "orderDiscount" REAL NOT NULL DEFAULT 0,
    "approximationDiscountValue" REAL,
    "paymentMethod" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customer" TEXT NOT NULL
);
INSERT INTO "new_LocalOrder" ("approximationDiscountValue", "currency", "customer", "id", "orderDiscount", "orderId", "paymentMethod", "status", "totalPrice") SELECT "approximationDiscountValue", "currency", "customer", "id", "orderDiscount", "orderId", "paymentMethod", "status", "totalPrice" FROM "LocalOrder";
DROP TABLE "LocalOrder";
ALTER TABLE "new_LocalOrder" RENAME TO "LocalOrder";
CREATE UNIQUE INDEX "LocalOrder_orderId_key" ON "LocalOrder"("orderId");
CREATE INDEX "LocalOrder_orderId_idx" ON "LocalOrder"("orderId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
