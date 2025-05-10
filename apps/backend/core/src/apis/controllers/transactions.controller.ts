import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { TransactionsService } from "../services/transactions.service";
import logger from "../../../config/logger";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionTypeEnum,
  TransactionType,
} from "@repo/types";

const transactionsService = new TransactionsService();

export class TransactionsController {
  async getTransactions(req: Request, res: Response) {
    try {
      const transactions = await transactionsService.findAll(req.user.userId);
      res.json(transactions);
    } catch (error) {
      logger.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getTransaction(req: Request, res: Response) {
    try {
      const transaction = await transactionsService.findOne(
        req.params.id,
        req.user.userId
      );
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      res.json(transaction);
    } catch (error) {
      logger.error("Error fetching transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createTransaction(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const transactionData: CreateTransactionDto = req.body;
      const transaction = await transactionsService.create(
        req.user.userId,
        transactionData
      );
      res.status(201).json(transaction);
    } catch (error) {
      logger.error("Error creating transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateTransaction(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const transactionData: UpdateTransactionDto = req.body;
      const transaction = await transactionsService.update(
        req.params.id,
        req.user.userId,
        transactionData
      );
      res.json(transaction);
    } catch (error) {
      logger.error("Error updating transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteTransaction(req: Request, res: Response) {
    try {
      await transactionsService.delete(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
