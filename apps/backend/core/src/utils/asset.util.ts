import { PrismaClient, Prisma } from "../../generated/prisma";
import { TransactionTypeEnum } from "@fin-compass/types";

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
  // Get the current asset to check for null values
  const asset = await client.asset.findUnique({
    where: { id: assetId },
    select: { income: true, expense: true },
  });

  if (!asset) {
    return;
  }

  let updateData: Prisma.AssetUpdateInput | null = null;

  if (type === TransactionTypeEnum.Income) {
    // Handle income case, setting to 0 first if it's null
    if (asset.income === null) {
      updateData = { income: updateAmount };
    } else {
      updateData = { income: { [operation]: updateAmount } };
    }
  } else if (type === TransactionTypeEnum.Expense) {
    // Handle expense case, setting to 0 first if it's null
    if (asset.expense === null) {
      updateData = { expense: updateAmount };
    } else {
      updateData = { expense: { [operation]: updateAmount } };
    }
  }

  if (updateData) {
    await client.asset.update({
      where: { id: assetId },
      data: updateData,
    });
  }
}
