/**
 * Formats a number as currency using the specified currency code
 * @param amount - The amount to format
 * @param currencyCode - ISO currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param locale - Locale for formatting (defaults to 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
};

/**
 * Formats a number as currency without the currency symbol
 * @param amount - The amount to format
 * @param currencyCode - ISO currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param locale - Locale for formatting (defaults to 'en-US')
 * @returns Formatted number string without currency symbol
 */
export const formatAmount = (
  amount: number,
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a number as a compact currency (e.g., $1.2K, $1.5M)
 * @param amount - The amount to format
 * @param currencyCode - ISO currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param locale - Locale for formatting (defaults to 'en-US')
 * @returns Formatted compact currency string
 */
export const formatCompactCurrency = (
  amount: number,
  currencyCode: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
};

/**
 * Gets the currency symbol for a given currency code
 * @param currencyCode - ISO currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param locale - Locale for formatting (defaults to 'en-US')
 * @returns Currency symbol
 */
export const getCurrencySymbol = (
  currencyCode: string = "USD",
  locale: string = "en-US"
): string => {
  return (
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || "$"
  );
};
