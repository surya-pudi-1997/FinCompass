import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserService } from "../services/users.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { decrypt, encrypt } from "@fin-compass/utils";

const userService = new UserService();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key";

export class UserController {
  async signup(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status_code: 400,
          status_txt: "Validation error",
          data: { errors: errors.array() },
        });
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
      res.status(201).json({
        status_code: 201,
        status_txt: "User created successfully",
        data: { user },
      });
    } catch (error: any) {
      if (error.message === "User already exists") {
        return res.status(409).json({
          status_code: 409,
          status_txt: error.message,
          data: {},
        });
      }
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status_code: 400,
          status_txt: "Validation error",
          data: { errors: errors.array() },
        });
      }

      // Decrypt login credentials
      const decryptedPassword = decrypt(
        req.body.password,
        ENCRYPTION_KEY
      ) as string;
      const { email } = req.body;

      const result = await userService.login(email, decryptedPassword);
      res.json({
        status_code: 200,
        status_txt: "Login successful",
        data: result,
      });
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({
          status_code: 401,
          status_txt: error.message,
          data: {},
        });
      }
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          status_code: 401,
          status_txt: "Unauthorized",
          data: {},
        });
      }

      const user = await userService.getUserById(userId);
      res.json({
        status_code: 200,
        status_txt: "Success",
        data: { user },
      });
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({
          status_code: 404,
          status_txt: error.message,
          data: {},
        });
      }
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          status_code: 401,
          status_txt: "Unauthorized",
          data: {},
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status_code: 400,
          status_txt: "Validation error",
          data: { errors: errors.array() },
        });
      }

      const user = await userService.updateUser(userId, req.body);
      res.json({
        status_code: 200,
        status_txt: "Profile updated successfully",
        data: { user },
      });
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({
          status_code: 404,
          status_txt: error.message,
          data: {},
        });
      }
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }

  async deleteAccount(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          status_code: 401,
          status_txt: "Unauthorized",
          data: {},
        });
      }

      const result = await userService.deleteUser(userId);
      res.json({
        status_code: 200,
        status_txt: "Account deleted successfully",
        data: result,
      });
    } catch (error: any) {
      if (error.message === "User not found") {
        return res.status(404).json({
          status_code: 404,
          status_txt: error.message,
          data: {},
        });
      }
      res.status(500).json({
        status_code: 500,
        status_txt: "Internal server error",
        data: {},
      });
    }
  }
}
