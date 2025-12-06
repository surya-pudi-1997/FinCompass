import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist, createJSONStorage } from "zustand/middleware";

import { UserWithoutPassword, UserResponse } from "@fin-compass/types";

interface UserState {
  user: UserWithoutPassword | null;
  isAuthenticated: boolean;
  token: string | null;
  // Loading states
  loginLoading: boolean;
  profileLoading: boolean;
  editProfileLoading: boolean;
  // Error states
  loginError: string | null;
  profileError: string | null;
  editProfileError: string | null;
}

interface UserActions {
  // Authentication state actions
  setUser: (user: UserWithoutPassword | null) => void;
  setToken: (token: string | null) => void;
  setAuthData: (user: UserWithoutPassword, token: string) => void;
  logout: () => void;

  // User CRUD actions
  updateUser: (updates: Partial<UserWithoutPassword>) => void;

  // Loading state actions
  setLoginLoading: (loading: boolean) => void;
  setProfileLoading: (loading: boolean) => void;
  setEditProfileLoading: (loading: boolean) => void;

  // Error state actions
  setLoginError: (error: string | null) => void;
  setProfileError: (error: string | null) => void;
  setEditProfileError: (error: string | null) => void;
  clearLoginError: () => void;
  clearProfileError: () => void;
  clearEditProfileError: () => void;
  clearAllErrors: () => void;

  // Utility actions
  isUserActive: () => boolean;
  getUserNetworth: () => number | undefined;
}

interface UserStore extends UserState, UserActions {}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  token: null,
  // Loading states
  loginLoading: false,
  profileLoading: false,
  editProfileLoading: false,
  // Error states
  loginError: null,
  profileError: null,
  editProfileError: null,
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Authentication state actions
        setUser: (user: UserWithoutPassword | null) => {
          set((state) => {
            state.user = user;
            state.isAuthenticated = !!user;
          });
        },

        setToken: (token: string | null) => {
          set((state) => {
            state.token = token;
          });
        },

        setAuthData: (user: UserWithoutPassword, token: string) => {
          set((state) => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
          });
        },

        logout: () => {
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          });
        },

        // User CRUD actions
        updateUser: (updates: Partial<UserWithoutPassword>) => {
          set((state) => {
            if (state.user) {
              Object.assign(state.user, updates);
              state.user.updatedAt = new Date().toISOString();
            }
          });
        },

        // Loading state actions
        setLoginLoading: (loading: boolean) => {
          set((state) => {
            state.loginLoading = loading;
          });
        },

        setProfileLoading: (loading: boolean) => {
          set((state) => {
            state.profileLoading = loading;
          });
        },

        setEditProfileLoading: (loading: boolean) => {
          set((state) => {
            state.editProfileLoading = loading;
          });
        },

        // Error state actions
        setLoginError: (error: string | null) => {
          set((state) => {
            state.loginError = error;
          });
        },

        setProfileError: (error: string | null) => {
          set((state) => {
            state.profileError = error;
          });
        },

        setEditProfileError: (error: string | null) => {
          set((state) => {
            state.editProfileError = error;
          });
        },

        clearLoginError: () => {
          set((state) => {
            state.loginError = null;
          });
        },

        clearProfileError: () => {
          set((state) => {
            state.profileError = null;
          });
        },

        clearEditProfileError: () => {
          set((state) => {
            state.editProfileError = null;
          });
        },

        clearAllErrors: () => {
          set((state) => {
            state.loginError = null;
            state.profileError = null;
            state.editProfileError = null;
          });
        },

        // Utility actions
        isUserActive: () => {
          const { user } = get();
          return user?.isActive ?? false;
        },

        getUserNetworth: () => {
          const { user } = get();
          return (user as UserResponse)?.networth;
        },
      })),
      {
        name: "user-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: "user-store",
    }
  )
);

// Selectors for better performance
export const useUserSelectors = {
  // User data selectors
  user: () => useUserStore((state) => state.user),
  isAuthenticated: () => useUserStore((state) => state.isAuthenticated),
  token: () => useUserStore((state) => state.token),
  userEmail: () => useUserStore((state) => state.user?.email),
  userFullName: () => useUserStore((state) => state.user?.fullName),
  preferredCurrency: () =>
    useUserStore((state) => state.user?.preferredCurrency),
  isUserActive: () => useUserStore((state) => state.isUserActive()),
  networth: () => useUserStore((state) => state.getUserNetworth()),

  // Loading state selectors
  loginLoading: () => useUserStore((state) => state.loginLoading),
  profileLoading: () => useUserStore((state) => state.profileLoading),
  editProfileLoading: () => useUserStore((state) => state.editProfileLoading),

  // Error state selectors
  loginError: () => useUserStore((state) => state.loginError),
  profileError: () => useUserStore((state) => state.profileError),
  editProfileError: () => useUserStore((state) => state.editProfileError),

  // Combined selectors
  hasAnyError: () =>
    useUserStore(
      (state) =>
        !!(state.loginError || state.profileError || state.editProfileError)
    ),
  isAnyLoading: () =>
    useUserStore(
      (state) =>
        state.loginLoading || state.profileLoading || state.editProfileLoading
    ),
};
