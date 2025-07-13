export enum TransactionCategoryTypeEnum {
  Income = "Income",
  Expense = "Expense",
  Investment = "Investment",
}

export type TransactionCategoryType = keyof typeof TransactionCategoryTypeEnum;

export interface CreateTransactionCategoryDto {
  name: string;
  type: TransactionCategoryType;
  icon?: string;
  isSystem?: boolean;
}

export interface UpdateTransactionCategoryDto
  extends Partial<CreateTransactionCategoryDto> {}

export interface Category extends CreateTransactionCategoryDto {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}
