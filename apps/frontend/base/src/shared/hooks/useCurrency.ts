import { useUserSelectors } from "@/shared/stores";
import {
  formatCurrency,
  formatCompactCurrency,
  formatAmount,
  getCurrencySymbol,
} from "@/shared/utils/currency";

/**
 * Custom hook that provides currency formatting functions using user's preferred currency
 * @returns Object with currency formatting functions that use user's preferred currency
 */
export const useCurrency = () => {
  const preferredCurrency = useUserSelectors.preferredCurrency();
  const userCurrency = preferredCurrency || "USD";

  return {
    /**
     * Formats amount using user's preferred currency
     */
    formatCurrency: (amount: number, locale?: string) =>
      formatCurrency(amount, userCurrency, locale),

    /**
     * Formats amount as compact currency using user's preferred currency
     */
    formatCompactCurrency: (amount: number, locale?: string) =>
      formatCompactCurrency(amount, userCurrency, locale),

    /**
     * Formats amount without currency symbol
     */
    formatAmount: (amount: number, locale?: string) =>
      formatAmount(amount, locale),

    /**
     * Gets the currency symbol for user's preferred currency
     */
    getCurrencySymbol: (locale?: string) =>
      getCurrencySymbol(userCurrency, locale),

    /**
     * Gets the user's preferred currency code
     */
    currencyCode: userCurrency,
  };
};
