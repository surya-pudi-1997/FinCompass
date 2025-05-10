export enum AccountTypeEnum {
    Savings = 'Savings',
    CreditCard = 'Credit Card',
    Investment = 'Investment',
    Other = 'Other'
}

export type AccountType = keyof typeof AccountTypeEnum;

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  balance?: number;
  encrypted_data?: string;
}

export interface UpdateAccountDto extends Partial<CreateAccountDto> {}