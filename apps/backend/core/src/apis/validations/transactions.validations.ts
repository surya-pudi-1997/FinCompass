import { body } from "express-validator";
import { TransactionTypeEnum } from "@fin-compass/types";

export const transactionValidation = {
  create: [
    body("accountId")
      .trim()
      .notEmpty()
      .withMessage("Account ID is required")
      .isUUID()
      .withMessage("Invalid account ID format"),
    body("assetId")
      .optional()
      .trim()
      .isUUID()
      .withMessage("Invalid asset ID format"),
    body("type")
      .trim()
      .notEmpty()
      .withMessage("Transaction type is required")
      .customSanitizer((value: string) => {
        // Find the matching enum key case-insensitively and return the correct casing
        const match = Object.entries(TransactionTypeEnum).find(
          ([key]) => key.toLowerCase() === value.toLowerCase()
        );
        return match ? match[0] : value;
      })
      .custom((value: string) => {
        if (!Object.keys(TransactionTypeEnum).includes(value)) {
          throw new Error("Invalid transaction type");
        }
        return true;
      }),
    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount must be a number"),
    body("categoryId")
      .trim()
      .notEmpty()
      .withMessage("Category ID is required")
      .isUUID()
      .withMessage("Invalid category ID format"),
    body("note").optional().trim(),
    body("timestamp")
      .notEmpty()
      .withMessage("Timestamp is required")
      .isISO8601()
      .withMessage("Invalid timestamp format"),
  ],

  update: [
    body("accountId")
      .optional()
      .trim()
      .isUUID()
      .withMessage("Invalid account ID format"),
    body("assetId")
      .optional()
      .trim()
      .isUUID()
      .withMessage("Invalid asset ID format"),
    body("type")
      .optional()
      .trim()
      .customSanitizer((value: string) => {
        const match = Object.entries(TransactionTypeEnum).find(
          ([key]) => key.toLowerCase() === value.toLowerCase()
        );
        return match ? match[0] : value;
      })
      .custom((value: string) => {
        if (!Object.keys(TransactionTypeEnum).includes(value)) {
          throw new Error("Invalid transaction type");
        }
        return true;
      }),
    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a number"),
    body("categoryId")
      .optional()
      .trim()
      .isUUID()
      .withMessage("Invalid category ID format"),
    body("note").optional().trim(),
    body("timestamp")
      .optional()
      .isISO8601()
      .withMessage("Invalid timestamp format"),
  ],
};
