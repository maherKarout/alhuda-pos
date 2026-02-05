/*
  Warnings:

  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `PrismaId` was added to the `products` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "PrismaId" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
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
INSERT INTO "new_products" ("barCode", "branchMask", "category", "code", "color", "company", "currencyGuid", "dim", "id", "individualPrice", "model", "name", "openPrice", "origin", "provenance", "quality", "unity", "wholesalePrice") SELECT "barCode", "branchMask", "category", "code", "color", "company", "currencyGuid", "dim", "id", "individualPrice", "model", "name", "openPrice", "origin", "provenance", "quality", "unity", "wholesalePrice" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
