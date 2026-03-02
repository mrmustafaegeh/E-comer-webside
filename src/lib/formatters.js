/**
 * Format a number as currency (default JPY based on product card)
 */
export function formatMoney(amount, currency = 'JPY') {
  if (amount === undefined || amount === null) return "¥ 0.00";
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format a date string or object
 */
export function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, length = 100) {
  if (!text || text.length <= length) return text;
  return text.slice(0, length) + "...";
}
