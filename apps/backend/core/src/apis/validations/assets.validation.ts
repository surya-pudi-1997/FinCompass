import { body } from "express-validator";
import { AssetTypeEnum, AssetStatusEnum } from "@fin-compass/types";

export const assetValidation = {
  create: [
    body("name").trim().notEmpty().withMessage("Asset name is required"),
    body("type")
      .trim()
      .notEmpty()
      .withMessage("Asset type is required")
      .customSanitizer((value: string) => {
        // Find the matching enum key case-insensitively and return the correct casing
        const match = Object.entries(AssetTypeEnum).find(
          ([key]) => key.toLowerCase() === value.toLowerCase()
        );
        return match ? match[0] : value;
      })
      .custom((value: string) => {
        if (!Object.keys(AssetTypeEnum).includes(value)) {
          throw new Error("Invalid asset type");
        }
        return true;
      }),
    body("value")
      .notEmpty()
      .withMessage("Asset value is required")
      .isNumeric()
      .withMessage("Value must be a number"),
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Asset status is required")
      .customSanitizer((value: string) => {
        // Find the matching enum key case-insensitively and return the correct casing
        const match = Object.entries(AssetStatusEnum).find(
          ([key]) => key.toLowerCase() === value.toLowerCase()
        );
        return match ? match[0] : value;
      })
      .custom((value: string) => {
        if (!Object.keys(AssetStatusEnum).includes(value)) {
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
        const match = Object.entries(AssetTypeEnum).find(
          ([key]) => key.toLowerCase() === value.toLowerCase()
        );
        return match ? match[0] : value;
      })
      .custom((value: string) => {
        if (!Object.keys(AssetTypeEnum).includes(value)) {
          throw new Error("Invalid asset type");
        }
        return true;
      }),
    body("value").optional().isNumeric().withMessage("Value must be a number"),
    body("status")
      .optional()
      .trim()
      .customSanitizer((value: string) => {
        const match = Object.entries(AssetStatusEnum).find(
          ([key]) => key.toLowerCase() === value.toLowerCase()
        );
        return match ? match[0] : value;
      })
      .custom((value: string) => {
        if (!Object.keys(AssetStatusEnum).includes(value)) {
          throw new Error("Invalid asset status");
        }
        return true;
      }),
  ],
};
