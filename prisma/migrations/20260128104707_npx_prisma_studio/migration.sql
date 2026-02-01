-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "individual_price" REAL NOT NULL,
    "wholesale_price" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "open_price" BOOLEAN NOT NULL DEFAULT false,
    "is_synced" BOOLEAN NOT NULL DEFAULT false,
    "server_id" TEXT,
    "last_synced" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "products_code_key" ON "products"("code");

-- CreateIndex
CREATE UNIQUE INDEX "products_server_id_key" ON "products"("server_id");
