import { PrismaClient, Prisma } from "../../generated/prisma";
import { TransactionTypeEnum } from "@repo/types";

const prisma = new PrismaClient();

type AssetTransactionOperation = {
  assetId: string;
  type: string;
  amount: Prisma.Decimal | number;
  isReverse?: boolean;
  tx?: Prisma.TransactionClient;
};

export async function handleAssetTransaction({
  assetId,
  type,
  amount,
  isReverse = false,
  tx,
}: AssetTransactionOperation): Promise<void> {
  const client = tx || prisma;
  const updateAmount = new Prisma.Decimal(amount);
  const operation = isReverse ? "decrement" : "increment";

  // Check if type is a valid transaction type
  if (
    ![TransactionTypeEnum.Income, TransactionTypeEnum.Expense].includes(
      type as any
    )
  ) {
    return;
  }

  const updateData =
    type === TransactionTypeEnum.Income
      ? { income: { [operation]: updateAmount } }
      : type === TransactionTypeEnum.Expense
        ? { expense: { [operation]: updateAmount } }
        : null;

  if (updateData) {
    await client.asset.update({
      where: { id: assetId },
      data: updateData,
    });
  }
}
