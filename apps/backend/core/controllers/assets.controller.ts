import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AssetsService } from "../services/assets.service";
import logger from "../config/logger";
import {
  CreateAssetDto,
  UpdateAssetDto,
  AssetTypeEnum,
  AssetStatusEnum,
  AssetType,
  AssetStatus,
} from "@repo/types";

const assetsService = new AssetsService();

export class AssetsController {
  async getAssets(req: Request, res: Response) {
    try {
      const assets = await assetsService.findAll(req.user.userId);
      res.json(assets);
    } catch (error) {
      logger.error("Error fetching assets:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAsset(req: Request, res: Response) {
    try {
      const asset = await assetsService.findOne(req.params.id, req.user.userId);
      if (!asset) {
        return res.status(404).json({ error: "Asset not found" });
      }
      res.json(asset);
    } catch (error) {
      logger.error("Error fetching asset:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createAsset(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const assetData: CreateAssetDto = req.body;
      const asset = await assetsService.create(req.user.userId, assetData);
      res.status(201).json(asset);
    } catch (error) {
      logger.error("Error creating asset:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateAsset(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const assetData: UpdateAssetDto = req.body;
      const asset = await assetsService.update(
        req.params.id,
        req.user.userId,
        assetData
      );
      res.json(asset);
    } catch (error) {
      logger.error("Error updating asset:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteAsset(req: Request, res: Response) {
    try {
      await assetsService.delete(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting asset:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
