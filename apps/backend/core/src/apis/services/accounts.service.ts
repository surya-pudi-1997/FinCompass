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

      return account;
    });
  }

  async update(id: string, userId: string, data: UpdateAccountDto) {
    return prisma.$transaction(async (tx) => {
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
      return tx.account.delete({
        where: { id },
      });
    });
  }
}
