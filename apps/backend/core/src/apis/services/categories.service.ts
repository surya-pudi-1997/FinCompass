import { PrismaClient } from "../../../generated/prisma";
import {
  CreateTransactionCategoryDto,
  UpdateTransactionCategoryDto,
} from "@fin-compass/types";

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

  async findByNameAndType(name: string, type: string, userId: string) {
    return prisma.transactionCategory.findFirst({
      where: { name, userId, type },
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
