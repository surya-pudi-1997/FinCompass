import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { CategoriesService } from "../services/categories.service";
import logger from "../../../config/logger";
import {
  CreateTransactionCategoryDto,
  UpdateTransactionCategoryDto,
} from "@repo/types";

const categoriesService = new CategoriesService();

export class CategoriesController {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await categoriesService.findAll(req.user.userId);
      res.json(categories);
    } catch (error) {
      logger.error("Error fetching categories:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getCategory(req: Request, res: Response) {
    try {
      const category = await categoriesService.findOne(
        req.params.id,
        req.user.userId
      );
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      logger.error("Error fetching category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createCategory(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const categoryData: CreateTransactionCategoryDto = req.body;
      const category = await categoriesService.create(
        req.user.userId,
        categoryData
      );
      res.status(201).json(category);
    } catch (error) {
      logger.error("Error creating category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateCategory(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const categoryData: UpdateTransactionCategoryDto = req.body;
      const category = await categoriesService.update(
        req.params.id,
        req.user.userId,
        categoryData
      );
      res.json(category);
    } catch (error) {
      logger.error("Error updating category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      await categoriesService.delete(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
