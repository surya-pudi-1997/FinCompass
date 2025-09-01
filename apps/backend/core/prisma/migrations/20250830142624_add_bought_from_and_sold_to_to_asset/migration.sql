-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "bought_from" UUID,
ADD COLUMN     "sold_to" UUID;

-- CreateIndex
CREATE INDEX "Asset_bought_from_idx" ON "Asset"("bought_from");

-- CreateIndex
CREATE INDEX "Asset_sold_to_idx" ON "Asset"("sold_to");

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_bought_from_fkey" FOREIGN KEY ("bought_from") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_sold_to_fkey" FOREIGN KEY ("sold_to") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
