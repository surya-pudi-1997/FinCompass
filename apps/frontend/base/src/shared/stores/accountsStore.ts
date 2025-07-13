import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

import { CreateAccountDto } from "@fin-compass/types";

interface Account extends CreateAccountDto {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountsState {
  accounts: Account[];
  selectedAccount: Account | null;
  // Loading states
  fetchAccountsLoading: boolean;
  fetchAccountLoading: boolean;
  createAccountLoading: boolean;
  updateAccountLoading: boolean;
  deleteAccountLoading: boolean;
  // Error states
  fetchAccountsError: string | null;
  fetchAccountError: string | null;
  createAccountError: string | null;
  updateAccountError: string | null;
  deleteAccountError: string | null;
}

interface AccountsActions {
  // Account data actions
  setAccounts: (accounts: Account[]) => void;
  setSelectedAccount: (account: Account | null) => void;
  addAccount: (account: Account) => void;
  updateAccount: (accountId: string, updates: Partial<Account>) => void;
  removeAccount: (accountId: string) => void;
  clearAccounts: () => void;

  // Loading state actions
  setFetchAccountsLoading: (loading: boolean) => void;
  setFetchAccountLoading: (loading: boolean) => void;
  setCreateAccountLoading: (loading: boolean) => void;
  setUpdateAccountLoading: (loading: boolean) => void;
  setDeleteAccountLoading: (loading: boolean) => void;

  // Error state actions
  setFetchAccountsError: (error: string | null) => void;
  setFetchAccountError: (error: string | null) => void;
  setCreateAccountError: (error: string | null) => void;
  setUpdateAccountError: (error: string | null) => void;
  setDeleteAccountError: (error: string | null) => void;
  clearFetchAccountsError: () => void;
  clearFetchAccountError: () => void;
  clearCreateAccountError: () => void;
  clearUpdateAccountError: () => void;
  clearDeleteAccountError: () => void;
  clearAllErrors: () => void;

  // Utility actions
  getAccountById: (accountId: string) => Account | undefined;
  getTotalBalance: () => number;
  getAccountsByType: (type: string) => Account[];
}

interface AccountsStore extends AccountsState, AccountsActions {}

const initialState: AccountsState = {
  accounts: [],
  selectedAccount: null,
  // Loading states
  fetchAccountsLoading: false,
  fetchAccountLoading: false,
  createAccountLoading: false,
  updateAccountLoading: false,
  deleteAccountLoading: false,
  // Error states
  fetchAccountsError: null,
  fetchAccountError: null,
  createAccountError: null,
  updateAccountError: null,
  deleteAccountError: null,
};

export const useAccountsStore = create<AccountsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Account data actions
        setAccounts: (accounts: Account[]) => {
          set((state) => {
            state.accounts = accounts;
          });
        },

        setSelectedAccount: (account: Account | null) => {
          set((state) => {
            state.selectedAccount = account;
          });
        },

        addAccount: (account: Account) => {
          set((state) => {
            state.accounts.push(account);
          });
        },

        updateAccount: (accountId: string, updates: Partial<Account>) => {
          set((state) => {
            const accountIndex = state.accounts.findIndex(
              (account) => account.id === accountId
            );
            if (accountIndex !== -1) {
              Object.assign(state.accounts[accountIndex], updates);
              state.accounts[accountIndex].updatedAt = new Date().toISOString();
            }
            // Update selected account if it's the one being updated
            if (state.selectedAccount?.id === accountId) {
              Object.assign(state.selectedAccount, updates);
              state.selectedAccount.updatedAt = new Date().toISOString();
            }
          });
        },

        removeAccount: (accountId: string) => {
          set((state) => {
            state.accounts = state.accounts.filter(
              (account) => account.id !== accountId
            );
            // Clear selected account if it's the one being deleted
            if (state.selectedAccount?.id === accountId) {
              state.selectedAccount = null;
            }
          });
        },

        clearAccounts: () => {
          set((state) => {
            state.accounts = [];
            state.selectedAccount = null;
          });
        },

        // Loading state actions
        setFetchAccountsLoading: (loading: boolean) => {
          set((state) => {
            state.fetchAccountsLoading = loading;
          });
        },

        setFetchAccountLoading: (loading: boolean) => {
          set((state) => {
            state.fetchAccountLoading = loading;
          });
        },

        setCreateAccountLoading: (loading: boolean) => {
          set((state) => {
            state.createAccountLoading = loading;
          });
        },

        setUpdateAccountLoading: (loading: boolean) => {
          set((state) => {
            state.updateAccountLoading = loading;
          });
        },

        setDeleteAccountLoading: (loading: boolean) => {
          set((state) => {
            state.deleteAccountLoading = loading;
          });
        },

        // Error state actions
        setFetchAccountsError: (error: string | null) => {
          set((state) => {
            state.fetchAccountsError = error;
          });
        },

        setFetchAccountError: (error: string | null) => {
          set((state) => {
            state.fetchAccountError = error;
          });
        },

        setCreateAccountError: (error: string | null) => {
          set((state) => {
            state.createAccountError = error;
          });
        },

        setUpdateAccountError: (error: string | null) => {
          set((state) => {
            state.updateAccountError = error;
          });
        },

        setDeleteAccountError: (error: string | null) => {
          set((state) => {
            state.deleteAccountError = error;
          });
        },

        clearFetchAccountsError: () => {
          set((state) => {
            state.fetchAccountsError = null;
          });
        },

        clearFetchAccountError: () => {
          set((state) => {
            state.fetchAccountError = null;
          });
        },

        clearCreateAccountError: () => {
          set((state) => {
            state.createAccountError = null;
          });
        },

        clearUpdateAccountError: () => {
          set((state) => {
            state.updateAccountError = null;
          });
        },

        clearDeleteAccountError: () => {
          set((state) => {
            state.deleteAccountError = null;
          });
        },

        clearAllErrors: () => {
          set((state) => {
            state.fetchAccountsError = null;
            state.fetchAccountError = null;
            state.createAccountError = null;
            state.updateAccountError = null;
            state.deleteAccountError = null;
          });
        },

        // Utility actions
        getAccountById: (accountId: string) => {
          const { accounts } = get();
          return accounts.find((account) => account.id === accountId);
        },

        getTotalBalance: () => {
          const { accounts } = get();
          return accounts.reduce((total, account) => {
            return total + (account.balance || 0);
          }, 0);
        },

        getAccountsByType: (type: string) => {
          const { accounts } = get();
          return accounts.filter((account) => account.type === type);
        },
      })),
      {
        name: "accounts-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          accounts: state.accounts,
          selectedAccount: state.selectedAccount,
        }),
      }
    ),
    {
      name: "accounts-store",
    }
  )
);

// Selectors for better performance
export const useAccountsSelectors = {
  // Account data selectors
  accounts: () => useAccountsStore((state) => state.accounts),
  selectedAccount: () => useAccountsStore((state) => state.selectedAccount),
  accountsCount: () => useAccountsStore((state) => state.accounts.length),
  totalBalance: () => useAccountsStore((state) => state.getTotalBalance()),

  // Loading state selectors
  fetchAccountsLoading: () =>
    useAccountsStore((state) => state.fetchAccountsLoading),
  fetchAccountLoading: () =>
    useAccountsStore((state) => state.fetchAccountLoading),
  createAccountLoading: () =>
    useAccountsStore((state) => state.createAccountLoading),
  updateAccountLoading: () =>
    useAccountsStore((state) => state.updateAccountLoading),
  deleteAccountLoading: () =>
    useAccountsStore((state) => state.deleteAccountLoading),

  // Error state selectors
  fetchAccountsError: () =>
    useAccountsStore((state) => state.fetchAccountsError),
  fetchAccountError: () => useAccountsStore((state) => state.fetchAccountError),
  createAccountError: () =>
    useAccountsStore((state) => state.createAccountError),
  updateAccountError: () =>
    useAccountsStore((state) => state.updateAccountError),
  deleteAccountError: () =>
    useAccountsStore((state) => state.deleteAccountError),

  // Combined selectors
  hasAnyError: () =>
    useAccountsStore(
      (state) =>
        !!(
          state.fetchAccountsError ||
          state.fetchAccountError ||
          state.createAccountError ||
          state.updateAccountError ||
          state.deleteAccountError
        )
    ),
  isAnyLoading: () =>
    useAccountsStore(
      (state) =>
        state.fetchAccountsLoading ||
        state.fetchAccountLoading ||
        state.createAccountLoading ||
        state.updateAccountLoading ||
        state.deleteAccountLoading
    ),

  // Utility selectors
  getAccountById: (accountId: string) =>
    useAccountsStore((state) => state.getAccountById(accountId)),
  getAccountsByType: (type: string) =>
    useAccountsStore((state) => state.getAccountsByType(type)),
};
