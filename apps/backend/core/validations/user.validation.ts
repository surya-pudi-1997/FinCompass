import { body } from 'express-validator';

export const userValidation = {
  signup: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom((value) => {
        // The password will be encrypted, so we just check if it exists
        return value && value.length > 0;
      }),
    body('fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required'),
    body('preferredCurrency')
      .trim()
      .notEmpty()
      .withMessage('Preferred currency is required'),
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .custom((value) => {
        // The password will be encrypted, so we just check if it exists
        return value && value.length > 0;
      }),
  ],

  update: [
    body('fullName')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Full name cannot be empty'),
    body('preferredCurrency')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Preferred currency cannot be empty'),
    body('password')
      .optional()
      .custom((value) => {
        // The password will be encrypted, so we just check if it exists
        return value && value.length > 0;
      })
      .withMessage('Password cannot be empty'),
  ],
};