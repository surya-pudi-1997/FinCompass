import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { TransactionsService } from "../services/transactions.service";
import { CategoriesService } from "../services/categories.service";
import logger from "../../../config/logger";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionTypeEnum,
  TransactionType,
} from "@fin-compass/types";

const transactionsService = new TransactionsService();
const categoriesService = new CategoriesService();

export class TransactionsController {
  async getTransactions(req: Request, res: Response) {
    try {
      const transactions = await transactionsService.findAll(req.user.userId);
      res.json({
        status_code: 200,
        status_txt: "Success",
        data: { transactions },
      });
    } catch (error) {
      logger.error("Error fetching transactions:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async getTransaction(req: Request, res: Response) {
    try {
      const transaction = await transactionsService.findOne(
        req.params.id,
        req.user.userId
      );
      if (!transaction) {
        return res.status(404).json({
          status_code: 404,
          status_txt: "Transaction not found",
          data: {},
        });
      }
      res.json({
        status_code: 200,
        status_txt: "Success",
        data: { transaction },
      });
    } catch (error) {
      logger.error("Error fetching transaction:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async createTransaction(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status_code: 400,
        status_txt: "Validation error",
        data: { errors: errors.array() },
      });
    }

    try {
      const category = await categoriesService.findOne(
        req.body.categoryId,
        req.user.userId
      );
      if (!category) {
        return res.status(400).json({
          status_code: 400,
          status_txt: "Invalid category",
          data: {},
        });
      }

      const transactionData: CreateTransactionDto = req.body;
      const transaction = await transactionsService.create(
        req.user.userId,
        transactionData
      );
      res.status(201).json({
        status_code: 201,
        status_txt: "Transaction created successfully",
        data: { transaction },
      });
    } catch (error) {
      logger.error("Error creating transaction:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async updateTransaction(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status_code: 400,
        status_txt: "Validation error",
        data: { errors: errors.array() },
      });
    }

    try {
      if (req.body.categoryId) {
        const category = await categoriesService.findOne(
          req.body.categoryId,
          req.user.userId
        );
        if (!category) {
          return res.status(400).json({
            status_code: 400,
            status_txt: "Invalid category",
            data: {},
          });
        }
      }

      const transactionData: UpdateTransactionDto = req.body;
      const transaction = await transactionsService.update(
        req.params.id,
        req.user.userId,
        transactionData
      );
      res.status(200).json({
        status_code: 200,
        status_txt: "Transaction updated successfully",
        data: { transaction },
      });
    } catch (error) {
      logger.error("Error updating transaction:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }
  async deleteTransaction(req: Request, res: Response) {
    try {
      await transactionsService.delete(req.params.id, req.user.userId);
      res.status(200).json({
        status_code: 204,
        status_txt: "Transaction deleted successfully",
        data: { id: req.params.id },
      });
    } catch (error) {
      logger.error("Error deleting transaction:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }
}
