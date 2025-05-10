import { body } from "express-validator";
import { TransactionCategoryTypeEnum } from "@repo/types";

export const categoryValidation = {
  create: [
    body("name").trim().notEmpty().withMessage("Category name is required"),
    body("type")
      .trim()
      .notEmpty()
      .withMessage("Category type is required")
      .customSanitizer((value: string) => {
        const match = Object.entries(TransactionCategoryTypeEnum).find(
          ([key]) => key.toLowerCase() === value.toLowerCase()
        );
        return match ? match[0] : value;
      })
      .custom((value: string) => {
        if (!Object.keys(TransactionCategoryTypeEnum).includes(value)) {
          throw new Error("Invalid category type");
        }
        return true;
      }),
    body("icon").optional().trim(),
    body("isSystem")
      .optional()
      .isBoolean()
      .withMessage("isSystem must be a boolean"),
  ],

  update: [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Category name cannot be empty"),
    body("type")
      .optional()
      .trim()
      .customSanitizer((value: string) => {
        const match = Object.entries(TransactionCategoryTypeEnum).find(
          ([key]) => key.toLowerCase() === value.toLowerCase()
        );
        return match ? match[0] : value;
      })
      .custom((value: string) => {
        if (!Object.keys(TransactionCategoryTypeEnum).includes(value)) {
          throw new Error("Invalid category type");
        }
        return true;
      }),
    body("icon").optional().trim(),
    body("isSystem")
      .optional()
      .isBoolean()
      .withMessage("isSystem must be a boolean"),
  ],
};
