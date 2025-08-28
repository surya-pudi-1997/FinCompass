// API transformation utilities
import { Account, AccountType } from "@fin-compass/types";

// Type for API response data (dates as strings)
export interface AccountApiResponse {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance?: number;
  encryptedData?: string;
  createdAt: string;
  updatedAt: string;
}

// Transform API response to typed interface (no transformation needed now since both use strings)
export const transformAccountFromApi = (apiAccount: AccountApiResponse): Account => ({
  ...apiAccount,
});

export const transformAccountsFromApi = (apiAccounts: AccountApiResponse[]): Account[] =>
  apiAccounts.map(transformAccountFromApi);
