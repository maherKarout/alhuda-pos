-- CreateTable
CREATE TABLE "LocalOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "orderGuid" TEXT,
    "totalPrice" REAL NOT NULL,
    "orderDiscount" REAL NOT NULL DEFAULT 0,
    "approximationDiscountValue" REAL,
    "customerOrderId" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customer" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "LocalOrderItem" (
    "orderId" TEXT NOT NULL,
    "productGuid" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "itemNote" TEXT,
    "syncStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LocalOrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LocalOrder" ("orderId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LocalOrderAmount" (
    "orderId" TEXT NOT NULL PRIMARY KEY,
    "usd" REAL NOT NULL DEFAULT 0,
    "syp" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LocalOrderAmount_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "LocalOrder" ("orderId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalOrder_orderId_key" ON "LocalOrder"("orderId");

-- CreateIndex
CREATE INDEX "LocalOrder_orderId_idx" ON "LocalOrder"("orderId");

-- CreateIndex
CREATE INDEX "LocalOrderItem_orderId_idx" ON "LocalOrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "LocalOrderItem_orderId_productGuid_key" ON "LocalOrderItem"("orderId", "productGuid");
