/*
  Warnings:

  - A unique constraint covering the columns `[bought_transaction]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sold_transaction]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "bought_transaction" UUID,
ADD COLUMN     "sold_transaction" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_bought_transaction_key" ON "Asset"("bought_transaction");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_sold_transaction_key" ON "Asset"("sold_transaction");

-- CreateIndex
CREATE INDEX "Asset_bought_transaction_idx" ON "Asset"("bought_transaction");

-- CreateIndex
CREATE INDEX "Asset_sold_transaction_idx" ON "Asset"("sold_transaction");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_bought_transaction_fkey" FOREIGN KEY ("bought_transaction") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_sold_transaction_fkey" FOREIGN KEY ("sold_transaction") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
