import { PrismaClient, Prisma } from "../../../generated/prisma";
import {
  CreateTransactionDto,
  TransactionTypeEnum,
  UpdateTransactionDto,
} from "@fin-compass/types";
import { updateNetworth } from "../../utils/networth.util";
import { handleAssetTransaction } from "../../utils/asset.util";
import logger from "../../../config/logger";
import { AccountsService } from "./accounts.service";

const prisma = new PrismaClient();
const accountsService = new AccountsService();

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
      // Find account within transaction
      const account = await tx.account.findFirst({
        where: { id: data.accountId, userId },
        select: { id: true, balance: true },
      });

      if (!account) {
        throw new Error("Account not found");
      }

      const amount = new Prisma.Decimal(data.amount);
      const currentBalance = new Prisma.Decimal(account.balance || 0);

      // Calculate new balance based on transaction type
      const newBalance =
        data.type === TransactionTypeEnum.Income
          ? currentBalance.plus(amount)
          : currentBalance.minus(amount);

      // First update the account
      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          ...data,
          userId,
          amount,
        },
        include: {
          account: true,
          asset: true,
          category: true,
        },
      });

      // Update networth based on transaction type
      switch (data.type) {
        case TransactionTypeEnum.Income:
        case TransactionTypeEnum.Investment:
          // For income and investments, increase networth
          await tx.user.update({
            where: { id: userId },
            data: {
              networth: {
                increment: amount,
              },
            },
          });
          break;
        case TransactionTypeEnum.Expense:
          // For expenses, decrease networth
          await tx.user.update({
            where: { id: userId },
            data: {
              networth: {
                decrement: amount,
              },
            },
          });
          break;
      }

      // if (data.assetId) {
      //   await handleAssetTransaction({
      //     assetId: data.assetId,
      //     type: data.type,
      //     amount: data.amount,
      //     tx,
      //   });
      // }

      return transaction;
    });
  }

  async update(id: string, userId: string, data: UpdateTransactionDto) {
    return prisma.$transaction(async (tx) => {
      // Get old transaction with its account
      const oldTransaction = await tx.transaction.findFirst({
        where: { id, userId },
        include: { account: true },
      });

      console.log({ oldTransaction });

      if (!oldTransaction) {
        throw new Error("Transaction not found");
      }

      const oldAmount = new Prisma.Decimal(oldTransaction.amount);
      const newAmount = new Prisma.Decimal(
        data.amount || oldTransaction.amount
      );

      console.log({ oldAmount, newAmount });

      // Validate new account if changing
      if (data.accountId && oldTransaction.accountId !== data.accountId) {
        const newAccount = await tx.account.findFirst({
          where: { id: data.accountId, userId },
        });

        if (!newAccount) {
          throw new Error("New account not found");
        }
      }

      // Handle networth and account balance changes
      // First, reverse the effect of old transaction
      switch (oldTransaction.type) {
        case TransactionTypeEnum.Income:
        case TransactionTypeEnum.Investment:
          // Reverse the addition to networth and account balance
          await Promise.all([
            tx.user.update({
              where: { id: userId },
              data: {
                networth: {
                  decrement: oldAmount,
                },
              },
            }),
            tx.account.update({
              where: { id: oldTransaction.accountId },
              data: {
                balance: {
                  decrement: oldAmount,
                },
              },
            }),
          ]);
          break;
        case TransactionTypeEnum.Expense:
          // Reverse the reduction from networth and account balance
          await Promise.all([
            tx.user.update({
              where: { id: userId },
              data: {
                networth: {
                  increment: oldAmount,
                },
              },
            }),
            tx.account.update({
              where: { id: oldTransaction.accountId },
              data: {
                balance: {
                  increment: oldAmount,
                },
              },
            }),
          ]);
          break;
      }

      // Then apply the effect of new transaction type
      const newType = data.type || oldTransaction.type;
      const newAccountId = data.accountId || oldTransaction.accountId;

      switch (newType) {
        case TransactionTypeEnum.Income:
        case TransactionTypeEnum.Investment:
          // Add to networth and account balance
          await Promise.all([
            tx.user.update({
              where: { id: userId },
              data: {
                networth: {
                  increment: newAmount,
                },
              },
            }),
            tx.account.update({
              where: { id: newAccountId },
              data: {
                balance: {
                  increment: newAmount,
                },
              },
            }),
          ]);
          break;
        case TransactionTypeEnum.Expense:
          // Subtract from networth and account balance
          await Promise.all([
            tx.user.update({
              where: { id: userId },
              data: {
                networth: {
                  decrement: newAmount,
                },
              },
            }),
            tx.account.update({
              where: { id: newAccountId },
              data: {
                balance: {
                  decrement: newAmount,
                },
              },
            }),
          ]);
          break;
      }

      // Update the transaction
      const transaction = await tx.transaction.update({
        where: { id, userId },
        data: {
          ...data,
          amount: newAmount,
        },
        include: {
          account: true,
          asset: true,
          category: true,
        },
      });

      return transaction;
    });
  }

  async delete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.findFirst({
        where: { id, userId },
        include: { account: true },
      });

      if (transaction) {
        const amount = new Prisma.Decimal(transaction.amount);
        const currentBalance = new Prisma.Decimal(
          transaction.account?.balance || 0
        );

        // Update account balance
        const updatedBalance =
          transaction.type === TransactionTypeEnum.Income
            ? currentBalance.minus(amount)
            : currentBalance.plus(amount);

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: updatedBalance },
        });

        // Update networth based on transaction type
        switch (transaction.type) {
          case TransactionTypeEnum.Income:
          case TransactionTypeEnum.Investment:
            // Remove from networth
            await tx.user.update({
              where: { id: userId },
              data: {
                networth: {
                  decrement: amount,
                },
              },
            });
            break;
          case TransactionTypeEnum.Expense:
            // Add back to networth
            await tx.user.update({
              where: { id: userId },
              data: {
                networth: {
                  increment: amount,
                },
              },
            });
            break;
        }

        // Reverse asset transaction if it exists
        // if (transaction.assetId) {
        //   await handleAssetTransaction({
        //     assetId: transaction.assetId,
        //     type: transaction.type,
        //     amount: transaction.amount,
        //     isReverse: true,
        //     tx,
        //   });
        // }
      }

      return tx.transaction.delete({
        where: { id, userId },
      });
    });
  }
}
