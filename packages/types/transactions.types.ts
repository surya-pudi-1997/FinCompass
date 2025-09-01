export enum TransactionTypeEnum {
  Income = "Income",
  Expense = "Expense",
  Investment = "Investment",
}

export type TransactionType = keyof typeof TransactionTypeEnum;

export interface CreateTransactionDto {
  accountId: string;
  assetId?: string;
  type: TransactionType;
  amount: number;
  categoryId: string; // Changed from category: string
  note?: string;
  timestamp: Date;
}

export type UpdateTransactionDto = CreateTransactionDto;

export interface Transaction extends CreateTransactionDto {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}
