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
      res.json({
        status_code: 200,
        status_txt: "Success",
        data: { accounts },
      });
    } catch (error) {
      logger.error("Error fetching accounts:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async getAccount(req: Request, res: Response) {
    try {
      const account = await accountsService.findOne(
        req.params.id,
        req.user.userId
      );
      if (!account) {
        return res.status(404).json({
          status_code: 404,
          status_txt: "Account not found",
          data: {},
        });
      }
      res.json({
        status_code: 200,
        status_txt: "Success",
        data: { account },
      });
    } catch (error) {
      logger.error("Error fetching account:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async createAccount(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status_code: 400,
        status_txt: "Validation error",
        data: { errors: errors.array() },
      });
    }

    try {
      const accountData: CreateAccountDto = req.body;
      const account = await accountsService.create(
        req.user.userId,
        accountData
      );
      res.status(201).json({
        status_code: 201,
        status_txt: "Account created successfully",
        data: { account },
      });
    } catch (error) {
      logger.error("Error creating account:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async updateAccount(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status_code: 400,
        status_txt: "Validation error",
        data: { errors: errors.array() },
      });
    }

    try {
      const accountData: UpdateAccountDto = req.body;
      const account = await accountsService.update(
        req.params.id,
        req.user.userId,
        accountData
      );
      res.json({
        status_code: 200,
        status_txt: "Account updated successfully",
        data: { account },
      });
    } catch (error) {
      logger.error("Error updating account:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }
  async deleteAccount(req: Request, res: Response) {
    try {
      await accountsService.delete(req.params.id, req.user.userId);
      res.status(200).json({
        status_code: 200,
        status_txt: "Account deleted successfully",
        data: { id: req.params.id },
      });
    } catch (error) {
      logger.error("Error deleting account:", error);
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }
}
