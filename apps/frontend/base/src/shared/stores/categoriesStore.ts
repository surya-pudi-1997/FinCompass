import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

import { Category, TransactionCategoryType } from "@fin-compass/types";

interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
  // Loading states
  fetchCategoriesLoading: boolean;
  fetchCategoryLoading: boolean;
  createCategoryLoading: boolean;
  updateCategoryLoading: boolean;
  deleteCategoryLoading: boolean;
  // Error states
  fetchCategoriesError: string | null;
  fetchCategoryError: string | null;
  createCategoryError: string | null;
  updateCategoryError: string | null;
  deleteCategoryError: string | null;
}

interface CategoriesActions {
  // Category data actions
  setCategories: (categories: Category[]) => void;
  setSelectedCategory: (category: Category | null) => void;
  addCategory: (category: Category) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  removeCategory: (categoryId: string) => void;
  clearCategories: () => void;

  // Loading state actions
  setFetchCategoriesLoading: (loading: boolean) => void;
  setFetchCategoryLoading: (loading: boolean) => void;
  setCreateCategoryLoading: (loading: boolean) => void;
  setUpdateCategoryLoading: (loading: boolean) => void;
  setDeleteCategoryLoading: (loading: boolean) => void;

  // Error state actions
  setFetchCategoriesError: (error: string | null) => void;
  setFetchCategoryError: (error: string | null) => void;
  setCreateCategoryError: (error: string | null) => void;
  setUpdateCategoryError: (error: string | null) => void;
  setDeleteCategoryError: (error: string | null) => void;
  clearFetchCategoriesError: () => void;
  clearFetchCategoryError: () => void;
  clearCreateCategoryError: () => void;
  clearUpdateCategoryError: () => void;
  clearDeleteCategoryError: () => void;
  clearAllErrors: () => void;

  // Utility actions
  getCategoryById: (categoryId: string) => Category | undefined;
  getCategoriesByType: (type: TransactionCategoryType) => Category[];
  getSystemCategories: () => Category[];
  getUserCategories: () => Category[];
  getIncomeCategories: () => Category[];
  getExpenseCategories: () => Category[];
  getInvestmentCategories: () => Category[];
}

interface CategoriesStore extends CategoriesState, CategoriesActions {}

const initialState: CategoriesState = {
  categories: [],
  selectedCategory: null,
  // Loading states
  fetchCategoriesLoading: false,
  fetchCategoryLoading: false,
  createCategoryLoading: false,
  updateCategoryLoading: false,
  deleteCategoryLoading: false,
  // Error states
  fetchCategoriesError: null,
  fetchCategoryError: null,
  createCategoryError: null,
  updateCategoryError: null,
  deleteCategoryError: null,
};

export const useCategoriesStore = create<CategoriesStore>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Category data actions
      setCategories: (categories: Category[]) => {
        set((state) => {
          state.categories = categories;
        });
      },

      setSelectedCategory: (category: Category | null) => {
        set((state) => {
          state.selectedCategory = category;
        });
      },

      addCategory: (category: Category) => {
        set((state) => {
          state.categories.push(category);
        });
      },

      updateCategory: (categoryId: string, updates: Partial<Category>) => {
        set((state) => {
          const categoryIndex = state.categories.findIndex(
            (category) => category.id === categoryId
          );
          if (categoryIndex !== -1) {
            Object.assign(state.categories[categoryIndex], updates);
          }
          // Update selected category if it's the one being updated
          if (state.selectedCategory?.id === categoryId) {
            Object.assign(state.selectedCategory, updates);
          }
        });
      },

      removeCategory: (categoryId: string) => {
        set((state) => {
          state.categories = state.categories.filter(
            (category) => category.id !== categoryId
          );
          // Clear selected category if it's the one being deleted
          if (state.selectedCategory?.id === categoryId) {
            state.selectedCategory = null;
          }
        });
      },

      clearCategories: () => {
        set((state) => {
          state.categories = [];
          state.selectedCategory = null;
        });
      },

      // Loading state actions
      setFetchCategoriesLoading: (loading: boolean) => {
        set((state) => {
          state.fetchCategoriesLoading = loading;
        });
      },

      setFetchCategoryLoading: (loading: boolean) => {
        set((state) => {
          state.fetchCategoryLoading = loading;
        });
      },

      setCreateCategoryLoading: (loading: boolean) => {
        set((state) => {
          state.createCategoryLoading = loading;
        });
      },

      setUpdateCategoryLoading: (loading: boolean) => {
        set((state) => {
          state.updateCategoryLoading = loading;
        });
      },

      setDeleteCategoryLoading: (loading: boolean) => {
        set((state) => {
          state.deleteCategoryLoading = loading;
        });
      },

      // Error state actions
      setFetchCategoriesError: (error: string | null) => {
        set((state) => {
          state.fetchCategoriesError = error;
        });
      },

      setFetchCategoryError: (error: string | null) => {
        set((state) => {
          state.fetchCategoryError = error;
        });
      },

      setCreateCategoryError: (error: string | null) => {
        set((state) => {
          state.createCategoryError = error;
        });
      },

      setUpdateCategoryError: (error: string | null) => {
        set((state) => {
          state.updateCategoryError = error;
        });
      },

      setDeleteCategoryError: (error: string | null) => {
        set((state) => {
          state.deleteCategoryError = error;
        });
      },

      clearFetchCategoriesError: () => {
        set((state) => {
          state.fetchCategoriesError = null;
        });
      },

      clearFetchCategoryError: () => {
        set((state) => {
          state.fetchCategoryError = null;
        });
      },

      clearCreateCategoryError: () => {
        set((state) => {
          state.createCategoryError = null;
        });
      },

      clearUpdateCategoryError: () => {
        set((state) => {
          state.updateCategoryError = null;
        });
      },

      clearDeleteCategoryError: () => {
        set((state) => {
          state.deleteCategoryError = null;
        });
      },

      clearAllErrors: () => {
        set((state) => {
          state.fetchCategoriesError = null;
          state.fetchCategoryError = null;
          state.createCategoryError = null;
          state.updateCategoryError = null;
          state.deleteCategoryError = null;
        });
      },

      // Utility actions
      getCategoryById: (categoryId: string) => {
        const { categories } = get();
        return categories.find((category) => category.id === categoryId);
      },

      getCategoriesByType: (type: TransactionCategoryType) => {
        const { categories } = get();
        return categories.filter((category) => category.type === type);
      },

      getSystemCategories: () => {
        const { categories } = get();
        return categories.filter((category) => category.isSystem === true);
      },

      getUserCategories: () => {
        const { categories } = get();
        return categories.filter((category) => category.isSystem !== true);
      },

      getIncomeCategories: () => {
        const { categories } = get();
        return categories.filter((category) => category.type === "Income");
      },

      getExpenseCategories: () => {
        const { categories } = get();
        return categories.filter((category) => category.type === "Expense");
      },

      getInvestmentCategories: () => {
        const { categories } = get();
        return categories.filter((category) => category.type === "Investment");
      },
    })),
    {
      name: "categories-store",
    }
  )
);

// Selectors for better performance
export const useCategoriesSelectors = {
  // Category data selectors
  categories: () => useCategoriesStore((state) => state.categories),
  selectedCategory: () => useCategoriesStore((state) => state.selectedCategory),
  categoriesCount: () => useCategoriesStore((state) => state.categories.length),

  // Loading state selectors
  fetchCategoriesLoading: () =>
    useCategoriesStore((state) => state.fetchCategoriesLoading),
  fetchCategoryLoading: () =>
    useCategoriesStore((state) => state.fetchCategoryLoading),
  createCategoryLoading: () =>
    useCategoriesStore((state) => state.createCategoryLoading),
  updateCategoryLoading: () =>
    useCategoriesStore((state) => state.updateCategoryLoading),
  deleteCategoryLoading: () =>
    useCategoriesStore((state) => state.deleteCategoryLoading),

  // Error state selectors
  fetchCategoriesError: () =>
    useCategoriesStore((state) => state.fetchCategoriesError),
  fetchCategoryError: () =>
    useCategoriesStore((state) => state.fetchCategoryError),
  createCategoryError: () =>
    useCategoriesStore((state) => state.createCategoryError),
  updateCategoryError: () =>
    useCategoriesStore((state) => state.updateCategoryError),
  deleteCategoryError: () =>
    useCategoriesStore((state) => state.deleteCategoryError),

  // Combined selectors
  hasAnyError: () =>
    useCategoriesStore(
      (state) =>
        !!(
          state.fetchCategoriesError ||
          state.fetchCategoryError ||
          state.createCategoryError ||
          state.updateCategoryError ||
          state.deleteCategoryError
        )
    ),
  isAnyLoading: () =>
    useCategoriesStore(
      (state) =>
        state.fetchCategoriesLoading ||
        state.fetchCategoryLoading ||
        state.createCategoryLoading ||
        state.updateCategoryLoading ||
        state.deleteCategoryLoading
    ),

  // Utility selectors
  getCategoryById: (categoryId: string) =>
    useCategoriesStore((state) => state.getCategoryById(categoryId)),
  getCategoriesByType: (type: TransactionCategoryType) =>
    useCategoriesStore((state) => state.getCategoriesByType(type)),
  systemCategories: () =>
    useCategoriesStore((state) => state.getSystemCategories()),
  userCategories: () =>
    useCategoriesStore((state) => state.getUserCategories()),
  incomeCategories: () =>
    useCategoriesStore((state) => state.getIncomeCategories()),
  expenseCategories: () =>
    useCategoriesStore((state) => state.getExpenseCategories()),
  investmentCategories: () =>
    useCategoriesStore((state) => state.getInvestmentCategories()),
};
