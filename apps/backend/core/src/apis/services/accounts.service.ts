import { PrismaClient, Prisma } from "../../../generated/prisma";
import { CreateAccountDto, UpdateAccountDto } from "@fin-compass/types";
import { updateNetworth } from "../../utils/networth.util";
import logger from "../../../config/logger";

const prisma = new PrismaClient();

export class AccountsService {
  async findAll(userId: string) {
    return prisma.account.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    return prisma.account.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, data: CreateAccountDto) {
    return prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          ...data,
          userId,
        },
      });

      if (data.balance) {
        await updateNetworth(userId, data.balance, "add", tx);
      }

      return account;
    });
  }

  async update(id: string, userId: string, data: UpdateAccountDto) {
    return prisma.$transaction(async (tx) => {
      // If balance is being updated, we need to handle networth changes
      if (data.balance !== undefined) {
        const oldAccount = await tx.account.findFirst({
          where: { id, userId },
        });

        if (oldAccount) {
          const balanceDifference =
            (data.balance || 0) - (Number(oldAccount.balance) || 0);
          await updateNetworth(
            userId,
            Math.abs(balanceDifference),
            balanceDifference >= 0 ? "add" : "subtract",
            tx
          );
        } else {
          await updateNetworth(userId, data.balance || 0, "add", tx);
        }
      }

      return tx.account.update({
        where: { id, userId },
        data,
      });
    });
  }

  async delete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { id, userId },
      });

      if (account?.balance) {
        // Remove account balance from networth
        await updateNetworth(userId, account.balance, "subtract", tx);
      }

      return tx.account.delete({
        where: { id, userId },
      });
    });
  }
}
