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
  category: string;
  note?: string;
  timestamp: Date;
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {}
