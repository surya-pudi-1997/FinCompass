import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserService } from "../services/users.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { decrypt, encrypt } from "@repo/utils";
import logger from "../../../config/logger";

const userService = new UserService();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key";

export class UserController {
  async signup(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Decrypt sensitive data
      const decryptedPassword = decrypt(
        req.body.password,
        ENCRYPTION_KEY
      ) as string;
      const userData = {
        ...req.body,
        password: decryptedPassword,
      };

      const user = await userService.createUser(userData);
      res.status(201).json(user);
    } catch (error: any) {
      if (error.message === "User already exists") {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Decrypt login credentials
      const decryptedPassword = decrypt(
        req.body.password,
        ENCRYPTION_KEY
      ) as string;
      const { email } = req.body;

      const result = await userService.login(email, decryptedPassword);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await userService.getUserById(userId);
      res.json(user);
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await userService.updateUser(userId, req.body);
      res.json(user);
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await userService.deleteUser(userId);
      res.json(result);
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
