export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  preferredCurrency: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  fullName?: string;
  preferredCurrency?: string;
  password?: string;
}

export interface LoginResponse {
  user: UserWithoutPassword;
  token: string;
}

export interface UserWithoutPassword {
  id: string;
  email: string;
  fullName: string;
  preferredCurrency: string;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteUserResponse {
  message: string;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  preferredCurrency: string;
  networth?: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLogin?: Date;
}
