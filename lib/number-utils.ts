/**
 * Format a number with commas as thousands separators
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumberWithCommas(num: number | string): string {
  const numStr = typeof num === 'string' ? num : String(num);
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * Round a number to a specified number of decimal places
 * @param num - The number to round
 * @param decimals - Number of decimal places (default: 0)
 * @returns Rounded number
 */
export function roundToDecimals(num: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Format a number as a percentage
 * @param num - The number to format (0-1 for 0-100%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatAsPercent(num: number, decimals: number = 2): string {
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Calculate the percentage change between two numbers
 * @param oldValue - The original value
 * @param newValue - The new value
 * @returns The percentage change (as a decimal)
 */
export function calculatePercentageChange(
  oldValue: number,
  newValue: number
): number {
  if (oldValue === 0) return newValue > 0 ? 1 : newValue < 0 ? -1 : 0;
  return (newValue - oldValue) / Math.abs(oldValue);
}

/**
 * Clamp a number between a minimum and maximum value
 * @param num - The number to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped number
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Generate a random number between min and max (inclusive)
 * @param min - The minimum value
 * @param max - The maximum value
 * @param decimals - Number of decimal places (default: 0)
 * @returns A random number between min and max
 */
export function randomInRange(
  min: number,
  max: number,
  decimals: number = 0
): number {
  const rand = Math.random() * (max - min) + min;
  return roundToDecimals(rand, decimals);
}

/**
 * Check if a number is within a range
 * @param num - The number to check
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns Boolean indicating if the number is within the range
 */
export function isInRange(
  num: number,
  min: number,
  max: number
): boolean {
  return num >= min && num <= max;
}

/**
 * Convert a number to a string with ordinal suffix (e.g., 1st, 2nd, 3rd, 4th)
 * @param num - The number to convert
 * @returns The number with ordinal suffix
 */
export function toOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return num + 'st';
  }
  if (j === 2 && k !== 12) {
    return num + 'nd';
  }
  if (j === 3 && k !== 13) {
    return num + 'rd';
  }
  
  return num + 'th';
}

/**
 * Format a large number with appropriate suffix (K, M, B, T)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string with suffix
 */
export function formatLargeNumber(num: number, decimals: number = 1): string {
  if (num === 0) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];
  
  const rx = /(\.\d*?[1-9])0+$|\..*?0*$/;
  const item = [...lookup].reverse().find(item => absNum >= item.value);
  
  return item
    ? sign + (absNum / item.value).toFixed(decimals).replace(rx, '$1') + item.symbol
    : '0';
}

/**
 * Calculate the average of an array of numbers
 * @param numbers - Array of numbers
 * @returns The average value
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
}

/**
 * Calculate the median of an array of numbers
 * @param numbers - Array of numbers
 * @returns The median value
 */
export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  
  const sorted = [...numbers].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  
  return sorted[middle];
}

/**
 * Calculate the sum of an array of numbers
 * @param numbers - Array of numbers
 * @returns The sum of all numbers
 */
export function calculateSum(numbers: number[]): number {
  return numbers.reduce((sum, num) => sum + num, 0);
}

/**
 * Calculate the minimum value in an array of numbers
 * @param numbers - Array of numbers
 * @returns The minimum value
 */
export function calculateMin(numbers: number[]): number {
  return Math.min(...numbers);
}

/**
 * Calculate the maximum value in an array of numbers
 * @param numbers - Array of numbers
 * @returns The maximum value
 */
export function calculateMax(numbers: number[]): number {
  return Math.max(...numbers);
}

/**
 * Check if a number is even
 * @param num - The number to check
 * @returns Boolean indicating if the number is even
 */
export function isEven(num: number): boolean {
  return num % 2 === 0;
}

/**
 * Check if a number is odd
 * @param num - The number to check
 * @returns Boolean indicating if the number is odd
 */
export function isOdd(num: number): boolean {
  return !isEven(num);
}

/**
 * Check if a number is an integer
 * @param num - The number to check
 * @returns Boolean indicating if the number is an integer
 */
export function isInteger(num: number): boolean {
  return Number.isInteger(num);
}

/**
 * Check if a number is a float
 * @param num - The number to check
 * @returns Boolean indicating if the number is a float
 */
export function isFloat(num: number): boolean {
  return Number(num) === num && num % 1 !== 0;
}

/**
 * Calculate the factorial of a number
 * @param num - The number to calculate factorial for (must be a non-negative integer)
 * @returns The factorial of the number
 */
export function factorial(num: number): number {
  if (num < 0 || !Number.isInteger(num)) {
    throw new Error('Factorial is only defined for non-negative integers');
  }
  
  if (num === 0 || num === 1) {
    return 1;
  }
  
  let result = 1;
  for (let i = 2; i <= num; i++) {
    result *= i;
  }
  
  return result;
}

/**
 * Convert a number to a string with leading zeros
 * @param num - The number to pad
 * @param length - The desired length of the resulting string
 * @returns The padded string
 */
export function padWithZeros(num: number, length: number): string {
  return String(num).padStart(length, '0');
}

/**
 * Format a number as a currency string
 * @param num - The number to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  num: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(num);
}
