import { create } from "zustand";
import { UserResponse } from "@fin-compass/types";

interface UserProfileState {
  user: UserResponse | null;
  loading: boolean;
  error: string | null;
  setUser: (user: UserResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearUser: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user: UserResponse) => set({ user, loading: false, error: null }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error, loading: false }),
  clearError: () => set({ error: null }),
  clearUser: () => set({ user: null, error: null }),
}));
