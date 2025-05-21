import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CategoriesService } from "../services/categories.service";
import logger from "../../../config/logger";
import {
  CreateTransactionCategoryDto,
  UpdateTransactionCategoryDto,
} from "@fin-compass/types";

const categoriesService = new CategoriesService();

export class CategoriesController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await categoriesService.findAll(req.user.userId);
      res.json({
        status_code: 200,
        status_txt: "Success",
        data: { categories },
      });
    } catch (error) {
      logger.error("Error fetching categories:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async getCategory(req: Request, res: Response) {
    try {
      const category = await categoriesService.findOne(
        req.params.id,
        req.user.userId
      );
      if (!category) {
        return res.status(404).json({
          status_code: 404,
          status_txt: "Category not found",
          data: {},
        });
      }
      res.json({
        status_code: 200,
        status_txt: "Success",
        data: { category },
      });
    } catch (error) {
      logger.error("Error fetching category:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async createCategory(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status_code: 400,
        status_txt: "Validation error",
        data: { errors: errors.array() },
      });
    }

    try {
      const categoryData: CreateTransactionCategoryDto = req.body;
      const category = await categoriesService.create(
        req.user.userId,
        categoryData
      );
      res.status(201).json({
        status_code: 201,
        status_txt: "Category created successfully",
        data: { category },
      });
    } catch (error) {
      logger.error("Error creating category:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async updateCategory(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status_code: 400,
        status_txt: "Validation error",
        data: { errors: errors.array() },
      });
    }

    try {
      const categoryData: UpdateTransactionCategoryDto = req.body;
      const category = await categoriesService.update(
        req.params.id,
        req.user.userId,
        categoryData
      );
      res.json({
        status_code: 200,
        status_txt: "Category updated successfully",
        data: { category },
      });
    } catch (error) {
      logger.error("Error updating category:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }
  async deleteCategory(req: Request, res: Response) {
    try {
      await categoriesService.delete(req.params.id, req.user.userId);
      res.status(204).json({
        status_code: 204,
        status_txt: "Category deleted successfully",
        data: { id: req.params.id },
      });
    } catch (error) {
      logger.error("Error deleting category:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }
}
