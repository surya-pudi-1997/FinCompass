import { PrismaClient, Prisma } from "../../generated/prisma";
import { TransactionTypeEnum } from "@repo/types";

const prisma = new PrismaClient();

export async function updateNetworth(
  userId: string,
  amount: Prisma.Decimal | number,
  operation: "add" | "subtract",
  tx?: Prisma.TransactionClient
): Promise<void> {
  const client = tx || prisma;
  try {
    const updateAmount = new Prisma.Decimal(amount);
    await client.user.update({
      where: { id: userId },
      data: {
        networth: {
          [operation === "add" ? "increment" : "decrement"]: updateAmount,
        },
      },
    });
  } catch (error) {
    console.error("Error updating networth:", error);
    throw new Error("Failed to update networth");
  }
}

export async function handleTransactionNetworth(
  userId: string,
  type: string,
  amount: Prisma.Decimal | number,
  isDelete: boolean = false,
  tx?: Prisma.TransactionClient
): Promise<void> {
  const transactionAmount = new Prisma.Decimal(amount);

  switch (type) {
    case TransactionTypeEnum.Income:
      await updateNetworth(
        userId,
        transactionAmount,
        isDelete ? "subtract" : "add",
        tx
      );
      break;
    case TransactionTypeEnum.Expense:
      await updateNetworth(
        userId,
        transactionAmount,
        isDelete ? "add" : "subtract",
        tx
      );
      break;
    case TransactionTypeEnum.Investment:
      await updateNetworth(
        userId,
        transactionAmount,
        isDelete ? "subtract" : "add",
        tx
      );
      break;
    // Self transfers don't affect networth
    default:
      break;
  }
}
