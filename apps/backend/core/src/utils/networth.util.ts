import logger from "../../config/logger";
import { PrismaClient, Prisma } from "../../generated/prisma";
import { TransactionTypeEnum } from "@fin-compass/types";

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

    // Check if networth is NULL and initialize to 0 if necessary
    const currentUser = await client.user.findUnique({
      where: { id: userId },
      select: { networth: true },
    });

    if (!currentUser) {
      logger.error(`User with ID ${userId} not found during networth update.`);
      throw new Error(`User with ID ${userId} not found.`);
    }

    if (currentUser.networth === null) {
      await client.user.update({
        where: { id: userId },
        data: { networth: new Prisma.Decimal(0) }, // Initialize with Prisma.Decimal(0)
      });
    }

    // Perform the increment or decrement operation
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
