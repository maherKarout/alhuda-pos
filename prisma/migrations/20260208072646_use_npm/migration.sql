-- CreateTable
CREATE TABLE "products" (
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

-- CreateTable
CREATE TABLE "Customer" (
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

-- CreateTable
CREATE TABLE "LocalOrder" (
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

-- CreateTable
CREATE TABLE "LocalOrderItem" (
    "orderId" TEXT NOT NULL,
    "productGuid" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "itemNote" TEXT,
    "syncStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("orderId", "productGuid"),
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

-- CreateTable
CREATE TABLE "CasherBox" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usd" REAL NOT NULL DEFAULT 0,
    "syp" REAL NOT NULL DEFAULT 0,
    "exchangeRate" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerId_key" ON "Customer"("customerId");

-- CreateIndex
CREATE INDEX "LocalOrder_orderId_idx" ON "LocalOrder"("orderId");
