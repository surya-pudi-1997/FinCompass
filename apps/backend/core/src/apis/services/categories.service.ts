import { PrismaClient } from "../../../generated/prisma";
import {
  CreateTransactionCategoryDto,
  UpdateTransactionCategoryDto,
} from "@repo/types";

const prisma = new PrismaClient();

export class CategoriesService {
  async findAll(userId: string) {
    return prisma.transactionCategory.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    return prisma.transactionCategory.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, data: CreateTransactionCategoryDto) {
    return prisma.transactionCategory.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateTransactionCategoryDto) {
    return prisma.transactionCategory.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return prisma.transactionCategory.delete({
      where: { id, userId },
    });
  }
}
