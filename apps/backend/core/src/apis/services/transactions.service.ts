import { PrismaClient } from "../../../generated/prisma";
import { CreateTransactionDto, UpdateTransactionDto } from "@repo/types";

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
    return prisma.transaction.create({
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
  }

  async update(id: string, userId: string, data: UpdateTransactionDto) {
    return prisma.transaction.update({
      where: { id, userId },
      data,
      include: {
        account: true,
        asset: true,
        category: true,
      },
    });
  }

  async delete(id: string, userId: string) {
    return prisma.transaction.delete({
      where: { id, userId },
    });
  }
}
