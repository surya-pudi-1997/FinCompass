import { PrismaClient } from "../../../generated/prisma";
import { CreateTransactionDto, UpdateTransactionDto } from "@repo/types";
import { handleTransactionNetworth } from "../../utils/networth.util";
import { handleAssetTransaction } from "../../utils/asset.util";
import logger from "../../../config/logger";

const prisma = new PrismaClient();

export class TransactionsService {
  async findAll(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      include: {
        account: true,
        asset: true,
        category: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    return prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account: true,
        asset: true,
        category: true,
      },
    });
  }

  async create(userId: string, data: CreateTransactionDto) {
    return prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          ...data,
          userId,
        },
        include: {
          account: true,
          asset: true,
          category: true,
        },
      });

      // Update networth
      await handleTransactionNetworth(
        userId,
        data.type,
        data.amount,
        false,
        tx
      );

      // If transaction is linked to an asset, update its income/expense
      if (data.assetId) {
        await handleAssetTransaction({
          assetId: data.assetId,
          type: data.type,
          amount: data.amount,
          tx,
        });
      }

      return transaction;
    });
  }

  async update(id: string, userId: string, data: UpdateTransactionDto) {
    return prisma.$transaction(async (tx) => {
      const oldTransaction = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (!oldTransaction) {
        throw new Error("Transaction not found");
      }

      // Reverse old transaction's networth effect
      await handleTransactionNetworth(
        userId,
        oldTransaction.type,
        oldTransaction.amount,
        true,
        tx
      );

      // Reverse old asset transaction if it exists
      if (oldTransaction.assetId) {
        await handleAssetTransaction({
          assetId: oldTransaction.assetId,
          type: oldTransaction.type,
          amount: oldTransaction.amount,
          isReverse: true,
          tx,
        });
      }

      // Update the transaction
      const transaction = await tx.transaction.update({
        where: { id, userId },
        data,
        include: {
          account: true,
          asset: true,
          category: true,
        },
      });

      // Apply new networth effect
      await handleTransactionNetworth(
        userId,
        transaction.type,
        transaction.amount,
        false,
        tx
      );

      // Apply new asset transaction if it exists
      if (transaction.assetId) {
        await handleAssetTransaction({
          assetId: transaction.assetId,
          type: transaction.type,
          amount: transaction.amount,
          tx,
        });
      }

      return transaction;
    });
  }

  async delete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: { id, userId },
      });

      if (transaction) {
        // Reverse networth effect
        await handleTransactionNetworth(
          userId,
          transaction.type,
          transaction.amount,
          true,
          tx
        );

        // Reverse asset transaction if it exists
        if (transaction.assetId) {
          await handleAssetTransaction({
            assetId: transaction.assetId,
            type: transaction.type,
            amount: transaction.amount,
            isReverse: true,
            tx,
          });
        }
      }

      return tx.transaction.delete({
        where: { id, userId },
      });
    });
  }
}
