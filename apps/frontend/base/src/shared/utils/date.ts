/**
 * Formats a date string into a localized date format
 * @param dateString - ISO date string to format
 * @param locale - Locale for formatting (defaults to 'en-US')
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string => {
  return new Date(dateString).toLocaleDateString(locale, options);
};

/**
 * Formats a date string into a relative time format (e.g., "2 days ago")
 * @param dateString - ISO date string to format
 * @returns Relative time string
 */
export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
};

/**
 * Formats a date string into a full datetime format
 * @param dateString - ISO date string to format
 * @param locale - Locale for formatting (defaults to 'en-US')
 * @returns Formatted datetime string
 */
export const formatDateTime = (
  dateString: string,
  locale: string = "en-US"
): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
