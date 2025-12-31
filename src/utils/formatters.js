/**
 * Format a number with thousand separators
 * @param {number|string} number - The number to format
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} Formatted number string
 */
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '0';
  const num = typeof number === 'string' ? parseFloat(number) : number;
  if (isNaN(num)) return '0';
  
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  });
};

/**
 * Format a price with currency symbol
 * @param {number|string} amount - The amount to format
 * @param {string} currency - Currency code (e.g., 'USD', 'EUR')
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, currency = 'USD', decimals = 2) => {
  if (amount === null || amount === undefined) return '$0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0.00';
  
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals
  }).format(num);
};

/**
 * Format a large number with K, M, B suffixes
 * @param {number|string} num - The number to format
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} Formatted number with suffix
 */
export const formatLargeNumber = (num, decimals = 1) => {
  if (num === null || num === undefined) return '0';
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return '0';
  
  if (Math.abs(number) >= 1000000000) {
    return (number / 1000000000).toFixed(decimals) + 'B';
  }
  if (Math.abs(number) >= 1000000) {
    return (number / 1000000).toFixed(decimals) + 'M';
  }
  if (Math.abs(number) >= 1000) {
    return (number / 1000).toFixed(decimals) + 'K';
  }
  return number.toString();
};
