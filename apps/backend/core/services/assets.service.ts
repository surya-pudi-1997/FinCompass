import { PrismaClient } from "../generated/prisma";
import { CreateAssetDto, UpdateAssetDto } from "@repo/types";

const prisma = new PrismaClient();

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
    return prisma.asset.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateAssetDto) {
    return prisma.asset.update({
      where: { id, userId },
      data,
    });
  }

  async delete(id: string, userId: string) {
    return prisma.asset.delete({
      where: { id, userId },
    });
  }
}
