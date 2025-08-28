import { PrismaClient } from "../../../generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  CreateUserInput,
  UpdateUserInput,
  LoginResponse,
  UserWithoutPassword,
  DeleteUserResponse,
  CreateAccountDto,
  CreateTransactionCategoryDto,
} from "@fin-compass/types";
import logger from "../../../config/logger";
import { AccountsService } from "./accounts.service";
import { CategoriesService } from "./categories.service";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const prisma = new PrismaClient();

// Helper function to transform Prisma user to UserWithoutPassword type
const transformUserToResponse = (user: any): UserWithoutPassword => {
  const { passwordHash, ...userWithoutPassword } = user;
  return {
    ...userWithoutPassword,
    networth: user.networth ? Number(user.networth) : undefined,
  };
};

const accountsService = new AccountsService();
const categoriesService = new CategoriesService();

export class UserService {
  async createUser(userData: CreateUserInput): Promise<UserWithoutPassword> {
    logger.info("Attempting to create new user", { email: userData.email });
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        logger.warn("User creation failed - email already exists", {
          email: userData.email,
        });
        throw new Error("User already exists");
      }

      const passwordHash = await bcrypt.hash(userData.password, 10);

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash,
          fullName: userData.fullName,
          preferredCurrency: userData.preferredCurrency,
        },
      });

      const defaultAccount: CreateAccountDto = {
        name: "Liquid",
        type: "Savings",
        balance: 0,
      };

      // create a default
      accountsService.create(user.id, defaultAccount);

      const defaultCategories: CreateTransactionCategoryDto[] = [
        {
          name: "personal-luxary",
          type: "Expense",
          icon: "💎",
          isSystem: true,
        },
        { name: "rent-received", type: "Income", icon: "🏠", isSystem: true },
        { name: "Cab", type: "Expense", icon: "🚗", isSystem: true },
        { name: "Electricity", type: "Expense", icon: "⚡", isSystem: true },
        { name: "junk food", type: "Expense", icon: "🍕", isSystem: true },
        { name: "food", type: "Expense", icon: "🍽️", isSystem: true },
        { name: "studies", type: "Expense", icon: "📚", isSystem: true },
        { name: "electronics", type: "Expense", icon: "📱", isSystem: true },
        {
          name: "house investment",
          type: "Expense",
          icon: "🏢",
          isSystem: true,
        },
        { name: "office needs", type: "Expense", icon: "💼", isSystem: true },
        { name: "clothing", type: "Expense", icon: "👕", isSystem: true },
        { name: "house-luxury", type: "Expense", icon: "🛋️", isSystem: true },
        { name: "salary", type: "Income", icon: "👛", isSystem: true },
        { name: "rent-paid", type: "Expense", icon: "🏠", isSystem: true },
        { name: "taxes", type: "Expense", icon: "🏛️", isSystem: true },
        { name: "house", type: "Expense", icon: "🏠", isSystem: true },
        { name: "maid", type: "Expense", icon: "👤", isSystem: true },
        { name: "mom clothing", type: "Expense", icon: "👚", isSystem: true },
        { name: "my clothing", type: "Expense", icon: "👕", isSystem: true },
        {
          name: "mobile recharge",
          type: "Expense",
          icon: "📱",
          isSystem: true,
        },
        { name: "gifting", type: "Expense", icon: "🎁", isSystem: true },
        { name: "travel", type: "Expense", icon: "✈️", isSystem: true },
        { name: "health", type: "Expense", icon: "❤️", isSystem: true },
      ];

      defaultCategories.map((category) => {
        categoriesService.create(user.id, category);
      });

      logger.info("User created successfully", {
        userId: user.id,
        email: user.email,
      });
      return transformUserToResponse(user);
    } catch (error) {
      logger.error("Error creating user", {
        email: userData.email,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    logger.info("Login attempt", { email });
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        logger.warn("Login failed - user not found", { email });
        throw new Error("Invalid credentials");
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        logger.warn("Login failed - invalid password", { email });
        throw new Error("Invalid credentials");
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      logger.info("Login successful", { userId: user.id, email });
      return { token };
    } catch (error) {
      logger.error("Error during login", {
        email,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserWithoutPassword> {
    logger.debug("Fetching user by ID", { userId: id });
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        logger.warn("User not found", { userId: id });
        throw new Error("User not found");
      }

      return transformUserToResponse(user);
    } catch (error) {
      logger.error("Error fetching user", {
        userId: id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async updateUser(
    id: string,
    userData: UpdateUserInput
  ): Promise<UserWithoutPassword> {
    logger.info("Attempting to update user", { userId: id });
    try {
      const updateData: any = { ...userData };
      if (userData.password) {
        updateData.passwordHash = await bcrypt.hash(userData.password, 10);
        delete updateData.password;
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      logger.info("User updated successfully", { userId: id });
      return transformUserToResponse(user);
    } catch (error) {
      logger.error("Error updating user", {
        userId: id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async deleteUser(id: string): Promise<DeleteUserResponse> {
    logger.info("Attempting to deactivate user", { userId: id });
    try {
      await prisma.user.update({
        where: { id },
        data: { isActive: false },
      });
      logger.info("User deactivated successfully", { userId: id });
      return { message: "User deactivated successfully" };
    } catch (error) {
      logger.error("Error deactivating user", {
        userId: id,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async getAllUsers(): Promise<UserWithoutPassword[]> {
    logger.debug("Fetching all users");
    try {
      const users = await prisma.user.findMany();
      return users.map((user) => transformUserToResponse(user));
    } catch (error) {
      logger.error("Error fetching all users", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
}
