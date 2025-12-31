import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param {...any} inputs - Class names to be combined
 * @returns {string} - Combined class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} [currency='USD'] - The currency code
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Formats a date string
 * @param {string|Date} date - The date to format
 * @param {Object} [options={}] - Formatting options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return new Date(date).toLocaleDateString(undefined, defaultOptions);
}

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} [length=50] - The maximum length of the text
 * @param {string} [ellipsis='...'] - The ellipsis string to append
 * @returns {string} - Truncated text
 */
export function truncate(text, length = 50, ellipsis = '...') {
  if (!text || text.length <= length) return text;
  return `${text.slice(0, length)}${ellipsis}`;
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - The function to debounce
 * @param {number} [wait=300] - The number of milliseconds to delay
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 * @param {Function} func - The function to throttle
 * @param {number} [limit=300] - The number of milliseconds to throttle invocations to
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generates a unique ID
 * @param {number} [length=8] - The length of the ID
 * @returns {string} - A unique ID string
 */
export function generateId(length = 8) {
  return Math.random().toString(36).substring(2, length + 2);
}

export default {
  cn,
  formatCurrency,
  formatDate,
  truncate,
  debounce,
  throttle,
  generateId,
};
