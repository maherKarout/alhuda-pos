-- CreateTable
CREATE TABLE "customers" (
    "prisma_id" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "numberOfInvoices" INTEGER NOT NULL,
    "totalPurchases" REAL NOT NULL,
    "totalPaymentSyp" REAL NOT NULL,
    "totalPaymentUsd" REAL NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_prisma_id_key" ON "customers"("prisma_id");
