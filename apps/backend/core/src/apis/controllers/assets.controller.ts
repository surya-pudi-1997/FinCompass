import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AssetsService } from "../services/assets.service";
import logger from "../../../config/logger";
import {
  CreateAssetDto,
  UpdateAssetDto,
  AssetTypeEnum,
  AssetStatusEnum,
  AssetType,
  AssetStatus,
} from "@fin-compass/types";

const assetsService = new AssetsService();

export class AssetsController {
  async getAssets(req: Request, res: Response) {
    try {
      const assets = await assetsService.findAll(req.user.userId);
      res.json({
        status_code: 200,
        status_txt: "Success",
        data: { assets },
      });
    } catch (error) {
      logger.error("Error fetching assets:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async getAsset(req: Request, res: Response) {
    try {
      const asset = await assetsService.findOne(req.params.id, req.user.userId);
      if (!asset) {
        return res.status(404).json({
          status_code: 404,
          status_txt: "Asset not found",
          data: {},
        });
      }
      res.json({
        status_code: 200,
        status_txt: "Success",
        data: { asset },
      });
    } catch (error) {
      logger.error("Error fetching asset:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async createAsset(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status_code: 400,
        status_txt: "Validation error",
        data: { errors: errors.array() },
      });
    }

    try {
      const assetData: CreateAssetDto = req.body;
      const asset = await assetsService.create(req.user.userId, assetData);
      res.status(201).json({
        status_code: 201,
        status_txt: "Asset created successfully",
        data: { asset },
      });
    } catch (error) {
      logger.error("Error creating asset:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async updateAsset(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status_code: 400,
        status_txt: "Validation error",
        data: { errors: errors.array() },
      });
    }

    try {
      const assetData: UpdateAssetDto = req.body;
      const asset = await assetsService.update(
        req.params.id,
        req.user.userId,
        assetData
      );
      res.json({
        status_code: 200,
        status_txt: "Asset updated successfully",
        data: { asset },
      });
    } catch (error) {
      logger.error("Error updating asset:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }
  async deleteAsset(req: Request, res: Response) {
    try {
      await assetsService.delete(req.params.id, req.user.userId);
      res.status(204).json({
        status_code: 204,
        status_txt: "Asset deleted successfully",
        data: { id: req.params.id },
      });
    } catch (error) {
      logger.error("Error deleting asset:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }
}
