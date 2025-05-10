import { body } from 'express-validator';
import { AccountTypeEnum } from '@repo/types';

export const accountValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Account name is required'),
    body('type')
      .trim()
      .notEmpty()
      .withMessage('Account type is required')
      .custom((value: string) => {
        if (!Object.values(AccountTypeEnum).includes(value as AccountTypeEnum)) {
            throw new Error('Invalid account type');
        }
        return true;
      }),
    body('balance')
      .optional()
      .isNumeric()
      .withMessage('Balance must be a number'),
    body('encrypted_data')
      .optional()
      .isString()
      .withMessage('Encrypted data must be a string')
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Account name cannot be empty'),
    body('type')
      .optional()
      .trim()
      .custom((value: string) => {
        if (!Object.values(AccountTypeEnum).includes(value as AccountTypeEnum)) {
            throw new Error('Invalid account type');
        }
        return true;
      }),
    body('balance')
      .optional()
      .isNumeric()
      .withMessage('Balance must be a number'),
    body('encrypted_data')
      .optional()
      .isString()
      .withMessage('Encrypted data must be a string')
  ]
};