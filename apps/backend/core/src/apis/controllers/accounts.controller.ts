import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AccountsService } from "../services/accounts.service";
import logger from "../../../config/logger";
import { CreateAccountDto, UpdateAccountDto } from "@fin-compass/types";

const accountsService = new AccountsService();

export class AccountsController {
  async getAccounts(req: Request, res: Response) {
    try {
      const accounts = await accountsService.findAll(req.user.userId);
      res.json(accounts);
    } catch (error) {
      logger.error("Error fetching accounts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAccount(req: Request, res: Response) {
    try {
      const account = await accountsService.findOne(
        req.params.id,
        req.user.userId
      );
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      logger.error("Error fetching account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async createAccount(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const accountData: CreateAccountDto = req.body;
      const account = await accountsService.create(
        req.user.userId,
        accountData
      );
      res.status(201).json(account);
    } catch (error) {
      logger.error("Error creating account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateAccount(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const accountData: UpdateAccountDto = req.body;
      const account = await accountsService.update(
        req.params.id,
        req.user.userId,
        accountData
      );
      res.json(account);
    } catch (error) {
      logger.error("Error updating account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      await accountsService.delete(req.params.id, req.user.userId);
      res.status(204).send();
    } catch (error) {
      logger.error("Error deleting account:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
