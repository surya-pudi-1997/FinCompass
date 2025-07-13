import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

import { Transaction, TransactionType } from "@fin-compass/types";

interface TransactionsState {
  transactions: Transaction[];
  selectedTransaction: Transaction | null;
  // Loading states
  fetchTransactionsLoading: boolean;
  fetchTransactionLoading: boolean;
  createTransactionLoading: boolean;
  updateTransactionLoading: boolean;
  deleteTransactionLoading: boolean;
  // Error states
  fetchTransactionsError: string | null;
  fetchTransactionError: string | null;
  createTransactionError: string | null;
  updateTransactionError: string | null;
  deleteTransactionError: string | null;
}

interface TransactionsActions {
  // Transaction data actions
  setTransactions: (transactions: Transaction[]) => void;
  setSelectedTransaction: (transaction: Transaction | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (
    transactionId: string,
    updates: Partial<Transaction>
  ) => void;
  removeTransaction: (transactionId: string) => void;
  clearTransactions: () => void;

  // Loading state actions
  setFetchTransactionsLoading: (loading: boolean) => void;
  setFetchTransactionLoading: (loading: boolean) => void;
  setCreateTransactionLoading: (loading: boolean) => void;
  setUpdateTransactionLoading: (loading: boolean) => void;
  setDeleteTransactionLoading: (loading: boolean) => void;

  // Error state actions
  setFetchTransactionsError: (error: string | null) => void;
  setFetchTransactionError: (error: string | null) => void;
  setCreateTransactionError: (error: string | null) => void;
  setUpdateTransactionError: (error: string | null) => void;
  setDeleteTransactionError: (error: string | null) => void;
  clearFetchTransactionsError: () => void;
  clearFetchTransactionError: () => void;
  clearCreateTransactionError: () => void;
  clearUpdateTransactionError: () => void;
  clearDeleteTransactionError: () => void;
  clearAllErrors: () => void;

  // Utility actions
  getTransactionById: (transactionId: string) => Transaction | undefined;
  getTransactionsByType: (type: TransactionType) => Transaction[];
  getTransactionsByAccount: (accountId: string) => Transaction[];
  getTransactionsByCategory: (categoryId: string) => Transaction[];
  getTransactionsByAsset: (assetId: string) => Transaction[];
  getIncomeTransactions: () => Transaction[];
  getExpenseTransactions: () => Transaction[];
  getInvestmentTransactions: () => Transaction[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getTotalInvestments: () => number;
  getNetCashFlow: () => number;
}

interface TransactionsStore extends TransactionsState, TransactionsActions {}

const initialState: TransactionsState = {
  transactions: [],
  selectedTransaction: null,
  // Loading states
  fetchTransactionsLoading: false,
  fetchTransactionLoading: false,
  createTransactionLoading: false,
  updateTransactionLoading: false,
  deleteTransactionLoading: false,
  // Error states
  fetchTransactionsError: null,
  fetchTransactionError: null,
  createTransactionError: null,
  updateTransactionError: null,
  deleteTransactionError: null,
};

export const useTransactionsStore = create<TransactionsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Transaction data actions
        setTransactions: (transactions: Transaction[]) => {
          set((state) => {
            state.transactions = transactions;
          });
        },

        setSelectedTransaction: (transaction: Transaction | null) => {
          set((state) => {
            state.selectedTransaction = transaction;
          });
        },

        addTransaction: (transaction: Transaction) => {
          set((state) => {
            state.transactions.push(transaction);
          });
        },

        updateTransaction: (
          transactionId: string,
          updates: Partial<Transaction>
        ) => {
          set((state) => {
            const transactionIndex = state.transactions.findIndex(
              (transaction) => transaction.id === transactionId
            );
            if (transactionIndex !== -1) {
              Object.assign(state.transactions[transactionIndex], updates);
            }
            // Update selected transaction if it's the one being updated
            if (state.selectedTransaction?.id === transactionId) {
              Object.assign(state.selectedTransaction, updates);
            }
          });
        },

        removeTransaction: (transactionId: string) => {
          set((state) => {
            state.transactions = state.transactions.filter(
              (transaction) => transaction.id !== transactionId
            );
            // Clear selected transaction if it's the one being deleted
            if (state.selectedTransaction?.id === transactionId) {
              state.selectedTransaction = null;
            }
          });
        },

        clearTransactions: () => {
          set((state) => {
            state.transactions = [];
            state.selectedTransaction = null;
          });
        },

        // Loading state actions
        setFetchTransactionsLoading: (loading: boolean) => {
          set((state) => {
            state.fetchTransactionsLoading = loading;
          });
        },

        setFetchTransactionLoading: (loading: boolean) => {
          set((state) => {
            state.fetchTransactionLoading = loading;
          });
        },

        setCreateTransactionLoading: (loading: boolean) => {
          set((state) => {
            state.createTransactionLoading = loading;
          });
        },

        setUpdateTransactionLoading: (loading: boolean) => {
          set((state) => {
            state.updateTransactionLoading = loading;
          });
        },

        setDeleteTransactionLoading: (loading: boolean) => {
          set((state) => {
            state.deleteTransactionLoading = loading;
          });
        },

        // Error state actions
        setFetchTransactionsError: (error: string | null) => {
          set((state) => {
            state.fetchTransactionsError = error;
          });
        },

        setFetchTransactionError: (error: string | null) => {
          set((state) => {
            state.fetchTransactionError = error;
          });
        },

        setCreateTransactionError: (error: string | null) => {
          set((state) => {
            state.createTransactionError = error;
          });
        },

        setUpdateTransactionError: (error: string | null) => {
          set((state) => {
            state.updateTransactionError = error;
          });
        },

        setDeleteTransactionError: (error: string | null) => {
          set((state) => {
            state.deleteTransactionError = error;
          });
        },

        clearFetchTransactionsError: () => {
          set((state) => {
            state.fetchTransactionsError = null;
          });
        },

        clearFetchTransactionError: () => {
          set((state) => {
            state.fetchTransactionError = null;
          });
        },

        clearCreateTransactionError: () => {
          set((state) => {
            state.createTransactionError = null;
          });
        },

        clearUpdateTransactionError: () => {
          set((state) => {
            state.updateTransactionError = null;
          });
        },

        clearDeleteTransactionError: () => {
          set((state) => {
            state.deleteTransactionError = null;
          });
        },

        clearAllErrors: () => {
          set((state) => {
            state.fetchTransactionsError = null;
            state.fetchTransactionError = null;
            state.createTransactionError = null;
            state.updateTransactionError = null;
            state.deleteTransactionError = null;
          });
        },

        // Utility actions
        getTransactionById: (transactionId: string) => {
          const { transactions } = get();
          return transactions.find(
            (transaction) => transaction.id === transactionId
          );
        },

        getTransactionsByType: (type: TransactionType) => {
          const { transactions } = get();
          return transactions.filter(
            (transaction) => transaction.type === type
          );
        },

        getTransactionsByAccount: (accountId: string) => {
          const { transactions } = get();
          return transactions.filter(
            (transaction) => transaction.accountId === accountId
          );
        },

        getTransactionsByCategory: (categoryId: string) => {
          const { transactions } = get();
          return transactions.filter(
            (transaction) => transaction.categoryId === categoryId
          );
        },

        getTransactionsByAsset: (assetId: string) => {
          const { transactions } = get();
          return transactions.filter(
            (transaction) => transaction.assetId === assetId
          );
        },

        getIncomeTransactions: () => {
          const { transactions } = get();
          return transactions.filter(
            (transaction) => transaction.type === "Income"
          );
        },

        getExpenseTransactions: () => {
          const { transactions } = get();
          return transactions.filter(
            (transaction) => transaction.type === "Expense"
          );
        },

        getInvestmentTransactions: () => {
          const { transactions } = get();
          return transactions.filter(
            (transaction) => transaction.type === "Investment"
          );
        },

        getTotalIncome: () => {
          const { transactions } = get();
          return transactions
            .filter((transaction) => transaction.type === "Income")
            .reduce((total, transaction) => total + transaction.amount, 0);
        },

        getTotalExpenses: () => {
          const { transactions } = get();
          return transactions
            .filter((transaction) => transaction.type === "Expense")
            .reduce((total, transaction) => total + transaction.amount, 0);
        },

        getTotalInvestments: () => {
          const { transactions } = get();
          return transactions
            .filter((transaction) => transaction.type === "Investment")
            .reduce((total, transaction) => total + transaction.amount, 0);
        },

        getNetCashFlow: () => {
          const { getTotalIncome, getTotalExpenses } = get();
          return getTotalIncome() - getTotalExpenses();
        },
      })),
      {
        name: "transactions-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          transactions: state.transactions,
          selectedTransaction: state.selectedTransaction,
        }),
      }
    ),
    {
      name: "transactions-store",
    }
  )
);

// Selectors for better performance
export const useTransactionsSelectors = {
  // Transaction data selectors
  transactions: () => useTransactionsStore((state) => state.transactions),
  selectedTransaction: () =>
    useTransactionsStore((state) => state.selectedTransaction),
  transactionsCount: () =>
    useTransactionsStore((state) => state.transactions.length),

  // Loading state selectors
  fetchTransactionsLoading: () =>
    useTransactionsStore((state) => state.fetchTransactionsLoading),
  fetchTransactionLoading: () =>
    useTransactionsStore((state) => state.fetchTransactionLoading),
  createTransactionLoading: () =>
    useTransactionsStore((state) => state.createTransactionLoading),
  updateTransactionLoading: () =>
    useTransactionsStore((state) => state.updateTransactionLoading),
  deleteTransactionLoading: () =>
    useTransactionsStore((state) => state.deleteTransactionLoading),

  // Error state selectors
  fetchTransactionsError: () =>
    useTransactionsStore((state) => state.fetchTransactionsError),
  fetchTransactionError: () =>
    useTransactionsStore((state) => state.fetchTransactionError),
  createTransactionError: () =>
    useTransactionsStore((state) => state.createTransactionError),
  updateTransactionError: () =>
    useTransactionsStore((state) => state.updateTransactionError),
  deleteTransactionError: () =>
    useTransactionsStore((state) => state.deleteTransactionError),

  // Combined selectors
  hasAnyError: () =>
    useTransactionsStore(
      (state) =>
        !!(
          state.fetchTransactionsError ||
          state.fetchTransactionError ||
          state.createTransactionError ||
          state.updateTransactionError ||
          state.deleteTransactionError
        )
    ),
  isAnyLoading: () =>
    useTransactionsStore(
      (state) =>
        state.fetchTransactionsLoading ||
        state.fetchTransactionLoading ||
        state.createTransactionLoading ||
        state.updateTransactionLoading ||
        state.deleteTransactionLoading
    ),

  // Utility selectors
  getTransactionById: (transactionId: string) =>
    useTransactionsStore((state) => state.getTransactionById(transactionId)),
  getTransactionsByType: (type: TransactionType) =>
    useTransactionsStore((state) => state.getTransactionsByType(type)),
  getTransactionsByAccount: (accountId: string) =>
    useTransactionsStore((state) => state.getTransactionsByAccount(accountId)),
  getTransactionsByCategory: (categoryId: string) =>
    useTransactionsStore((state) =>
      state.getTransactionsByCategory(categoryId)
    ),
  getTransactionsByAsset: (assetId: string) =>
    useTransactionsStore((state) => state.getTransactionsByAsset(assetId)),
  incomeTransactions: () =>
    useTransactionsStore((state) => state.getIncomeTransactions()),
  expenseTransactions: () =>
    useTransactionsStore((state) => state.getExpenseTransactions()),
  investmentTransactions: () =>
    useTransactionsStore((state) => state.getInvestmentTransactions()),
  totalIncome: () => useTransactionsStore((state) => state.getTotalIncome()),
  totalExpenses: () =>
    useTransactionsStore((state) => state.getTotalExpenses()),
  totalInvestments: () =>
    useTransactionsStore((state) => state.getTotalInvestments()),
  netCashFlow: () => useTransactionsStore((state) => state.getNetCashFlow()),
};
