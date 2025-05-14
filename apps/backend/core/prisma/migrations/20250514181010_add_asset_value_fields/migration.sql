/*
  Warnings:

  - You are about to drop the column `value` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the `RecurringPayment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bought_value` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecurringPayment" DROP CONSTRAINT "RecurringPayment_userId_fkey";

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "value",
ADD COLUMN     "bought_value" DECIMAL NOT NULL,
ADD COLUMN     "expense" DECIMAL NOT NULL DEFAULT 0,
ADD COLUMN     "income" DECIMAL NOT NULL DEFAULT 0,
ADD COLUMN     "sold_value" DECIMAL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "networth" DECIMAL;

-- DropTable
DROP TABLE "RecurringPayment";
