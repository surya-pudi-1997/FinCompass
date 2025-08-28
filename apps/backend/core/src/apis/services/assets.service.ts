import { PrismaClient, Prisma } from "../../../generated/prisma";
import { CreateAssetDto, UpdateAssetDto } from "@fin-compass/types";
import { updateNetworth } from "../../utils/networth.util";
import logger from "../../../config/logger";

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
    return prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: {
          ...data,
          userId,
          expense: data?.expense || 0,
          income: data?.income || 0,
        },
      });
      logger.info(`Asset created for user ${userId}: ${JSON.stringify(asset)}`);
      // Only add to networth if asset is active
      if (data.status === "Active") {
        await updateNetworth(userId, data.bought_value, "add", tx);
      }

      return asset;
    });
  }

  async update(id: string, userId: string, data: UpdateAssetDto) {
    return prisma.$transaction(async (tx) => {
      const oldAsset = await tx.asset.findFirst({
        where: { id, userId },
      });

      // Handle networth changes if bought_value or status is being updated
      if (
        oldAsset &&
        (data.bought_value !== undefined || data.status !== undefined)
      ) {
        // Remove old value from networth if asset was active
        if (oldAsset.status === "Active" && data.bought_value !== undefined) {
          await updateNetworth(userId, oldAsset.bought_value, "subtract", tx);
          await updateNetworth(userId, data.bought_value, "add", tx);
        } else if (data.status === "Active" && oldAsset.status !== "Active") {
          await updateNetworth(
            userId,
            data.bought_value || oldAsset.bought_value,
            "add",
            tx
          );
        } else if (data.status === "Sold" && oldAsset.status === "Active") {
          await updateNetworth(userId, oldAsset.bought_value, "subtract", tx);
        }
      }

      return tx.asset.update({
        where: { id, userId },
        data,
      });
    });
  }

  async delete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const asset = await tx.asset.findFirst({
        where: { id, userId },
      });

      if (asset?.status === "Active") {
        // Remove asset value from networth if it was active
        await updateNetworth(userId, asset.bought_value, "subtract", tx);
      }

      return tx.asset.delete({
        where: { id, userId },
      });
    });
  }
}
