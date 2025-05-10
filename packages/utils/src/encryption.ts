import { AES, enc } from 'crypto-js';

/**
 * Encrypts data using AES-256 encryption
 * @param data - The data to encrypt (can be string or object)
 * @param secretKey - The secret key for encryption
 * @returns Encrypted string
 */
export const encrypt = (data: string | object, secretKey: string): string => {
  const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
  return AES.encrypt(dataString, secretKey).toString();
};

/**
 * Decrypts AES-256 encrypted data
 * @param encryptedData - The encrypted string to decrypt
 * @param secretKey - The secret key for decryption
 * @returns Decrypted data (attempts to parse as JSON if possible)
 */
export const decrypt = (encryptedData: string, secretKey: string): string | object => {
  const decrypted = AES.decrypt(encryptedData, secretKey).toString(enc.Utf8);
  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
};