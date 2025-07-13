// API Endpoints
export const API_ENDPOINTS = {
  // User Authentication
  LOGIN: "/api/user/login",
  REGISTER: "/api/user/register",
  LOGOUT: "/api/user/logout",

  // User Profile
  GET_PROFILE: "/api/user/fetch",
  UPDATE_PROFILE: "/api/user/edit",
  DELETE_PROFILE: "/api/user/remove",

  // Accounts
  GET_ACCOUNTS: "/api/accounts/fetch",
  GET_ACCOUNT: "/api/accounts/fetch",
  CREATE_ACCOUNT: "/api/accounts/create",
  UPDATE_ACCOUNT: "/api/accounts/edit",
  DELETE_ACCOUNT: "/api/accounts/delete",

  // Assets
  GET_ASSETS: "/api/assets/fetch",
  GET_ASSET: "/api/assets/fetch",
  CREATE_ASSET: "/api/assets/create",
  UPDATE_ASSET: "/api/assets/edit",
  DELETE_ASSET: "/api/assets/delete",

  // Transactions
  GET_TRANSACTIONS: "/api/transactions/fetch",
  GET_TRANSACTION: "/api/transactions/fetch",
  CREATE_TRANSACTION: "/api/transactions/create",
  UPDATE_TRANSACTION: "/api/transactions/edit",
  DELETE_TRANSACTION: "/api/transactions/delete",

  // Categories
  GET_CATEGORIES: "/api/categories/fetch",
  GET_CATEGORY: "/api/categories/fetch",
  CREATE_CATEGORY: "/api/categories/create",
  UPDATE_CATEGORY: "/api/categories/edit",
  DELETE_CATEGORY: "/api/categories/delete",
} as const;

// API Methods
export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
  PATCH: "PATCH",
} as const;
