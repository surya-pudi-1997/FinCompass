import { body } from "express-validator";

// Define the valid values based on your type unions
const VALID_ASSET_TYPES: string[] = [
  "Real Estate",
  "Vehicle",
  "Stock",
  "Bond",
  "Other",
];
const VALID_ASSET_STATUSES: string[] = ["Active", "Sold"];

export const assetValidation = {
  create: [
    body("name").trim().notEmpty().withMessage("Asset name is required"),
    body("type")
      .trim()
      .notEmpty()
      .withMessage("Asset type is required")
      .customSanitizer((value: string) => {
        // Find the matching type case-insensitively and return the correct casing
        const match = VALID_ASSET_TYPES.find(
          (type) => type.toLowerCase() === value.toLowerCase()
        );
        return match || value;
      })
      .custom((value: string) => {
        if (!VALID_ASSET_TYPES.includes(value)) {
          throw new Error("Invalid asset type");
        }
        return true;
      }),
    body("bought_value")
      .notEmpty()
      .withMessage("Asset bought value is required")
      .isNumeric()
      .withMessage("Bought value must be a number"),
    body("sold_value")
      .optional()
      .isNumeric()
      .withMessage("Sold value must be a number"),
    body("expense")
      .optional()
      .isNumeric()
      .withMessage("Expense must be a number"),
    body("income")
      .optional()
      .isNumeric()
      .withMessage("Income must be a number"),
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Asset status is required")
      .customSanitizer((value: string) => {
        // Find the matching status case-insensitively and return the correct casing
        const match = VALID_ASSET_STATUSES.find(
          (status) => status.toLowerCase() === value.toLowerCase()
        );
        return match || value;
      })
      .custom((value: string) => {
        if (!VALID_ASSET_STATUSES.includes(value)) {
          throw new Error("Invalid asset status");
        }
        return true;
      }),
  ],

  update: [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Asset name cannot be empty"),
    body("type")
      .optional()
      .trim()
      .customSanitizer((value: string) => {
        const match = VALID_ASSET_TYPES.find(
          (type) => type.toLowerCase() === value.toLowerCase()
        );
        return match || value;
      })
      .custom((value: string) => {
        if (!VALID_ASSET_TYPES.includes(value)) {
          throw new Error("Invalid asset type");
        }
        return true;
      }),
    body("bought_value")
      .optional()
      .isNumeric()
      .withMessage("Bought value must be a number"),
    body("sold_value")
      .optional()
      .isNumeric()
      .withMessage("Sold value must be a number"),
    body("expense")
      .optional()
      .isNumeric()
      .withMessage("Expense must be a number"),
    body("income")
      .optional()
      .isNumeric()
      .withMessage("Income must be a number"),
    body("status")
      .optional()
      .trim()
      .customSanitizer((value: string) => {
        const match = VALID_ASSET_STATUSES.find(
          (status) => status.toLowerCase() === value.toLowerCase()
        );
        return match || value;
      })
      .custom((value: string) => {
        if (!VALID_ASSET_STATUSES.includes(value)) {
          throw new Error("Invalid asset status");
        }
        return true;
      }),
  ],
};
