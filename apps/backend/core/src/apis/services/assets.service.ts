import { PrismaClient, Prisma } from "../../../generated/prisma";
import {
  CreateAssetDto,
  CreateTransactionDto,
  TransactionTypeEnum,
  UpdateAssetDto,
} from "@fin-compass/types";
import { updateNetworth } from "../../utils/networth.util";
import logger from "../../../config/logger";
import { AccountsService } from "./accounts.service";
import { TransactionsService } from "./transactions.service";
import { CategoriesService } from "./categories.service";

const prisma = new PrismaClient();
const accountsService = new AccountsService();
const transactionsService = new TransactionsService();
const categoriesService = new CategoriesService();

export class AssetsService {
  async findAll(userId: string) {
    return prisma.asset.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    return prisma.asset.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, data: CreateAssetDto) {
    return prisma.$transaction(async (tx) => {
      // Validate and prepare bought_value
      const boughtValue = new Prisma.Decimal(data.bought_value || 0);

      // First, if bought_from is provided, validate the account and category
      if (data.bought_from) {
        // Check if account exists
        const account = await tx.account.findFirst({
          where: { id: data.bought_from, userId },
          select: { id: true },
        });

        if (!account) {
          throw new Error("Account not found");
        }

        // Get investment category for this asset type
        const investmentCategory = await tx.transactionCategory.findFirst({
          where: {
            userId,
            type: TransactionTypeEnum.Investment,
            name: data.type,
            isSystem: true,
          },
          select: { id: true },
        });

        if (!investmentCategory) {
          throw new Error("Invalid asset category");
        }

        // First create the asset
        const asset = await tx.asset.create({
          data: {
            ...data,
            userId,
            bought_value: boughtValue,
            expense: new Prisma.Decimal(data?.expense || 0),
            income: new Prisma.Decimal(data?.income || 0),
          },
        });

        // Then create the transaction
        const transaction = await tx.transaction.create({
          data: {
            userId,
            type: TransactionTypeEnum.Investment,
            amount: boughtValue,
            accountId: data.bought_from,
            categoryId: investmentCategory.id,
            assetId: asset.id,
            timestamp: new Date(),
            note: `Automatic transaction created for buying ${data.name}`,
          },
        });

        // Update the asset with the transaction reference
        const updatedAsset = await tx.asset.update({
          where: { id: asset.id },
          data: { bought_transaction: transaction.id },
        });

        // Update account balance and networth atomically
        await Promise.all([
          tx.account.update({
            where: { id: data.bought_from },
            data: {
              balance: {
                decrement: boughtValue,
              },
            },
          }),
        ]);

        logger.info(
          `Asset created with transaction for user ${userId}: ${JSON.stringify(updatedAsset)}`
        );
        return updatedAsset;
      } else {
        // If no bought_from, just create asset and update networth
        const asset = await tx.asset.create({
          data: {
            ...data,
            userId,
            bought_value: boughtValue,
            expense: new Prisma.Decimal(data?.expense || 0),
            income: new Prisma.Decimal(data?.income || 0),
          },
        });

        // Update networth directly
        await tx.user.update({
          where: { id: userId },
          data: {
            networth: {
              increment: boughtValue,
            },
          },
        });

        logger.info(
          `Asset created for user ${userId}: ${JSON.stringify(asset)}`
        );
        return asset;
      }
    });
  }

  async update(id: string, userId: string, data: UpdateAssetDto) {
    return prisma.$transaction(async (tx) => {
      // Get asset first
      const oldAsset = await tx.asset.findFirst({
        where: { id, userId },
      });

      if (!oldAsset) {
        throw new Error(`Asset not found`);
      }

      const updateData: any = {};
      const oldValue = new Prisma.Decimal(oldAsset.bought_value);
      const newValue = data.bought_value
        ? new Prisma.Decimal(data.bought_value)
        : oldValue;

      // Case 1: Asset had a transaction and still will have one
      if (oldAsset.bought_transaction && data.bought_from) {
        // Update transaction if account or amount changed
        if (
          oldAsset.bought_from !== data.bought_from ||
          !oldValue.equals(newValue)
        ) {
          // Get the old transaction to know the old account
          const oldTransaction = await tx.transaction.findUnique({
            where: { id: oldAsset.bought_transaction },
            select: { accountId: true },
          });

          if (oldTransaction) {
            // Return money to old account
            await tx.account.update({
              where: { id: oldTransaction.accountId },
              data: {
                balance: {
                  increment: oldValue,
                },
              },
            });

            // Remove money from new account
            await tx.account.update({
              where: { id: data.bought_from },
              data: {
                balance: {
                  decrement: newValue,
                },
              },
            });
          }

          // Update the transaction
          await tx.transaction.update({
            where: { id: oldAsset.bought_transaction },
            data: {
              amount: newValue,
              accountId: data.bought_from,
            },
          });

          updateData.bought_from = data.bought_from;
          updateData.bought_value = newValue;
        }
      }
      // Case 2: Asset had a transaction but won't anymore
      else if (oldAsset.bought_transaction && !data.bought_from) {
        const oldTransaction = await tx.transaction.findUnique({
          where: { id: oldAsset.bought_transaction },
          select: { accountId: true },
        });

        if (oldTransaction) {
          // Delete transaction
          await tx.transaction.delete({
            where: { id: oldAsset.bought_transaction },
          });

          // Return money to account
          await tx.account.update({
            where: { id: oldTransaction.accountId },
            data: {
              balance: {
                increment: oldValue,
              },
            },
          });
        }

        updateData.bought_transaction = null;
        updateData.bought_from = null;
        updateData.bought_value = newValue;
        updateData.is_existing = true;

        // Update networth directly since no transaction exists now
        await tx.user.update({
          where: { id: userId },
          data: {
            networth: {
              increment: newValue,
            },
          },
        });
      }
      // Case 3: Asset didn't have transaction but will have one now
      else if (!oldAsset.bought_transaction && data.bought_from) {
        // Get investment category
        const category = await tx.transactionCategory.findFirst({
          where: {
            userId,
            type: TransactionTypeEnum.Investment,
            name: data.type || oldAsset.type,
            isSystem: true,
          },
          select: { id: true },
        });

        if (!category) {
          throw new Error("Investment category not found");
        }

        // Remove old value from networth since it will be handled by transaction
        await Promise.all([
          tx.user.update({
            where: { id: userId },
            data: {
              networth: {
                decrement: oldValue,
              },
            },
          }),
          tx.account.update({
            where: { id: data.bought_from },
            data: {
              balance: {
                decrement: newValue,
              },
            },
          }),
        ]);

        // Create new transaction
        const transaction = await tx.transaction.create({
          data: {
            userId,
            type: TransactionTypeEnum.Investment,
            amount: newValue,
            accountId: data.bought_from,
            categoryId: category.id,
            assetId: id,
            timestamp: new Date(),
            note: `Automatic transaction created for buying ${data.name || oldAsset.name}`,
          },
        });

        updateData.bought_transaction = transaction.id;
        updateData.bought_from = data.bought_from;
        updateData.bought_value = newValue;
        updateData.is_existing = false;
      }
      // Case 4: Asset didn't have transaction and still won't
      else if (
        !oldAsset.bought_transaction &&
        !data.bought_from &&
        !oldValue.equals(newValue)
      ) {
        // Update networth directly with the difference
        await tx.user.update({
          where: { id: userId },
          data: {
            networth: {
              increment: newValue.sub(oldValue),
            },
          },
        });
        updateData.bought_value = newValue;
      }

      // Handle sold status changes
      if (data.status === "Sold") {
        const soldValue = new Prisma.Decimal(data.sold_value || 0);

        // Case 1: Asset was active and now being sold
        if (oldAsset.status === "Active" && data.sold_to) {
          // Get investment category for income transaction
          const incomeCategory = await tx.transactionCategory.findFirst({
            where: {
              userId,
              type: TransactionTypeEnum.Income,
              name: "Returns",
              isSystem: true,
            },
            select: { id: true },
          });

          if (!incomeCategory) {
            throw new Error("Income category not found for asset type");
          }

          // Create sale transaction
          const saleTransaction = await tx.transaction.create({
            data: {
              userId,
              type: TransactionTypeEnum.Income,
              amount: soldValue,
              accountId: data.sold_to,
              categoryId: incomeCategory.id,
              assetId: id,
              timestamp: new Date(),
              note: `Automatic transaction created for selling ${oldAsset.name}`,
            },
          });

          // Update account balance
          await tx.account.update({
            where: { id: data.sold_to },
            data: {
              balance: {
                increment: soldValue,
              },
            },
          });

          // Update asset data
          updateData.status = "Sold";
          updateData.sold_to = data.sold_to;
          updateData.sold_value = soldValue;
          updateData.sold_transaction = saleTransaction.id;

          // If it wasn't a transaction-based asset, remove from networth
          await tx.user.update({
            where: { id: userId },
            data: {
              networth: {
                increment: soldValue.minus(
                  Prisma.Decimal(data.bought_value || 0)
                ),
              },
            },
          });
        }
        // Case 2: Asset was already sold and updating sold details
        else if (oldAsset.status === "Sold" && oldAsset.sold_transaction) {
          const oldSaleTransaction = await tx.transaction.findUnique({
            where: { id: oldAsset.sold_transaction },
            select: { accountId: true, amount: true },
          });

          if (oldSaleTransaction) {
            const newSoldValue = new Prisma.Decimal(
              data.sold_value || oldAsset.sold_value
            );

            if (
              data.sold_to !== oldAsset.sold_to ||
              !newSoldValue.equals(oldSaleTransaction.amount)
            ) {
              // Return money from old account
              await tx.account.update({
                where: { id: oldSaleTransaction.accountId },
                data: {
                  balance: {
                    decrement: oldSaleTransaction.amount,
                  },
                },
              });

              await tx.user.update({
                where: { id: userId },
                data: {
                  networth: {
                    decrement: oldSaleTransaction.amount,
                  },
                },
              });

              // Add money to new account
              await tx.account.update({
                where: { id: data.sold_to || oldAsset.sold_to },
                data: {
                  balance: {
                    increment: newSoldValue,
                  },
                },
              });

              await tx.user.update({
                where: { id: userId },
                data: {
                  networth: {
                    increment: newSoldValue,
                  },
                },
              });

              // Update the sale transaction
              await tx.transaction.update({
                where: { id: oldAsset.sold_transaction },
                data: {
                  amount: newSoldValue,
                  accountId: data.sold_to || oldAsset.sold_to,
                },
              });

              updateData.sold_to = data.sold_to;
              updateData.sold_value = newSoldValue;
            }
          }
        }
        // Case 3: Asset was sold and now changing back to active
        else if (
          oldAsset.status === "Sold" &&
          data.status &&
          oldAsset.sold_transaction &&
          oldAsset.sold_to &&
          oldAsset.sold_value
        ) {
          const oldSaleTransaction = await tx.transaction.findUnique({
            where: { id: oldAsset.sold_transaction },
            select: { accountId: true, amount: true },
          });

          if (oldSaleTransaction) {
            const soldValue = new Prisma.Decimal(oldAsset.sold_value);

            // Delete the sale transaction
            await tx.transaction.delete({
              where: { id: oldAsset.sold_transaction },
            });

            // Return money from the sold_to account
            await tx.account.update({
              where: { id: oldAsset.sold_to },
              data: {
                balance: {
                  decrement: soldValue,
                },
              },
            });

            // Update networth by removing sold value and adding back bought value
            await tx.user.update({
              where: { id: userId },
              data: {
                networth: {
                  increment: oldValue.sub(soldValue),
                },
              },
            });

            // Reset sold-related fields
            updateData.status = data.status;
            updateData.sold_to = null;
            updateData.sold_value = null;
            updateData.sold_transaction = null;
          }
        }

        // Handle other fields
        const additionalFields: (keyof UpdateAssetDto)[] = [
          "name",
          "type",
          "expense",
        ];
        additionalFields.forEach((field) => {
          if (data?.[field] !== undefined && oldAsset[field] !== data[field]) {
            updateData[field] = data[field];
          }
        });

        // Only update if there are changes
        if (Object.keys(updateData).length > 0) {
          return tx.asset.update({
            where: { id, userId },
            data: updateData,
          });
        }

        return oldAsset;
      }
    });
  }

  async delete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      // Get asset with its transaction details
      const asset = await tx.asset.findFirst({
        where: { id, userId },
      });

      if (!asset) {
        throw new Error("Asset not found");
      }

      const boughtValue = new Prisma.Decimal(asset.bought_value);

      if (asset.bought_transaction) {
        // If asset has a transaction, get transaction details first
        const transaction = await tx.transaction.findUnique({
          where: { id: asset.bought_transaction },
          select: {
            accountId: true,
            amount: true,
          },
        });

        if (transaction) {
          // Delete the transaction first
          await tx.transaction.delete({
            where: { id: asset.bought_transaction },
          });

          // Return the amount to the account and adjust networth
          await Promise.all([
            tx.account.update({
              where: { id: transaction.accountId },
              data: {
                balance: {
                  increment: boughtValue,
                },
              },
            }),
          ]);
        }
      } else if (asset.status === "Active") {
        // If no transaction but asset is active, just update networth
        await tx.user.update({
          where: { id: userId },
          data: {
            networth: {
              decrement: boughtValue,
            },
          },
        });
      }

      // Finally delete the asset
      return tx.asset.delete({
        where: { id, userId },
      });
    });
  }
}
