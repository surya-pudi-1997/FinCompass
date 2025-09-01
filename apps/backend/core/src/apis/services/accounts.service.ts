import { PrismaClient, Prisma } from "../../../generated/prisma";
import { CreateAccountDto, UpdateAccountDto } from "@fin-compass/types";
import { updateNetworth } from "../../utils/networth.util";
import logger from "../../../config/logger";

const prisma = new PrismaClient();

export class AccountsService {
  async findAll(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, userId: string) {
    return prisma.account.findFirst({
      where: {
        AND: [{ id }, { userId }],
      },
    });
  }

  async create(userId: string, data: CreateAccountDto) {
    return prisma.$transaction(async (tx) => {
      // Create account with a single query
      const account = await tx.account.create({
        data: {
          ...data,
          userId,
        },
      });

      if (data.balance) {
        await tx.user.update({
          where: { id: userId },
          data: {
            networth: {
              increment: data.balance,
            },
          },
        });
      }

      return account;
    });
  }

  async update(id: string, userId: string, data: UpdateAccountDto) {
    return prisma.$transaction(async (tx) => {
      const oldAccount = await tx.account.findFirst({
        where: {
          AND: [{ id }, { userId }],
        },
        select: {
          balance: true,
        },
      });

      if (oldAccount && data.balance !== undefined) {
        const balanceDifference =
          (data.balance || 0) - (Number(oldAccount.balance) || 0);

        // Update networth atomically
        if (balanceDifference !== 0) {
          await tx.user.update({
            where: { id: userId },
            data: {
              networth: {
                [balanceDifference > 0 ? "increment" : "decrement"]:
                  Math.abs(balanceDifference),
              },
            },
          });
        }
      }

      return tx.account.update({
        where: { id },
        data: {
          ...data,
        },
      });
    });
  }

  async delete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: {
          AND: [{ id }, { userId }],
        },
        select: {
          balance: true,
        },
      });

      if (account?.balance) {
        // Update networth atomically
        await tx.user.update({
          where: { id: userId },
          data: {
            networth: {
              decrement: account.balance,
            },
          },
        });
      }

      return tx.account.delete({
        where: { id },
      });
    });
  }
}
