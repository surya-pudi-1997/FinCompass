import { PrismaClient } from "../generated/prisma";
import { CreateAccountDto, UpdateAccountDto } from "@repo/types";

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
    return prisma.account.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateAccountDto) {
    return prisma.account.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return prisma.account.delete({
      where: { id, userId },
    });
  }
}
