-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CasherBox" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usd" REAL NOT NULL DEFAULT 0,
    "syp" REAL NOT NULL DEFAULT 0,
    "exchangeRate" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CasherBox" ("createdAt", "id", "syp", "updatedAt", "usd") SELECT "createdAt", "id", "syp", "updatedAt", "usd" FROM "CasherBox";
DROP TABLE "CasherBox";
ALTER TABLE "new_CasherBox" RENAME TO "CasherBox";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
