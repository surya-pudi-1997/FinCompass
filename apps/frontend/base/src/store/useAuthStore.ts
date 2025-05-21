import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  fullName: string;
  preferredCurrency: string;
  networth: number | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  error: {
    login: string | null;
    signup: {
      email: string | null;
      password: string | null;
      confirmPassword: string | null;
      fullName: string | null;
      preferredCurrency: string | null;
    };
  };
  clearAuth: () => void;
  setLoginError: (error: string | null) => void;
  setSignupError: (
    field: keyof AuthState["error"]["signup"],
    error: string | null
  ) => void;
  clearErrors: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      error: {
        login: null,
        signup: {
          email: null,
          password: null,
          confirmPassword: null,
          fullName: null,
          preferredCurrency: null,
        },
      },
      setAuth: (user: User, token: string) =>
        set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
      setLoginError: (error: string | null) =>
        set((state) => ({
          error: { ...state.error, login: error },
        })),
      setSignupError: (
        field: keyof AuthState["error"]["signup"],
        error: string | null
      ) =>
        set((state) => ({
          error: {
            ...state.error,
            signup: {
              ...state.error.signup,
              [field]: error,
            },
          },
        })),
      clearErrors: () =>
        set({
          error: {
            login: null,
            signup: {
              email: null,
              password: null,
              confirmPassword: null,
              fullName: null,
              preferredCurrency: null,
            },
          },
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
