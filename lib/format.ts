/**
 * Format a number as a currency string
 * @param value - The number to format
 * @param currency - The currency code (default: 'USD')
 * @param maximumFractionDigits - Maximum number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  maximumFractionDigits: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format a large number with appropriate suffix (K, M, B, T)
 * @param num - The number to format
 * @param decimals - Number of decimal places to show (default: 2)
 * @returns Formatted string with suffix
 */
export function formatLargeNumber(num: number, decimals: number = 2): string {
  if (num === 0) return '0';
  
  const k = 1000;
  const sizes = ['', 'K', 'M', 'B', 'T'];
  const i = Math.floor(Math.log(Math.abs(num)) / Math.log(k));
  
  // Handle very large or small numbers
  if (i < 0 || i >= sizes.length) {
    return num.toExponential(decimals);
  }
  
  return parseFloat((num / Math.pow(k, i)).toFixed(decimals)) + sizes[i];
}

/**
 * Format a percentage value
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercent(
  value: number,
  decimals: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format a cryptocurrency amount with appropriate decimal places
 * @param amount - The amount to format
 * @param symbol - The cryptocurrency symbol (e.g., 'BTC')
 * @param maxDecimals - Maximum number of decimal places (default: 8)
 * @returns Formatted amount with symbol
 */
export function formatCrypto(
  amount: number,
  symbol: string,
  maxDecimals: number = 8
): string {
  // Determine the appropriate number of decimal places
  let decimals = maxDecimals;
  
  if (amount >= 1) {
    decimals = Math.min(2, maxDecimals);
  } else if (amount >= 0.1) {
    decimals = Math.min(4, maxDecimals);
  } else if (amount >= 0.01) {
    decimals = Math.min(6, maxDecimals);
  }
  
  // Format the number with the determined decimal places
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
  
  return `${formatter.format(amount)} ${symbol.toUpperCase()}`;
}

/**
 * Format a timestamp as a relative time string (e.g., "2 hours ago")
 * @param timestamp - The timestamp in milliseconds
 * @returns Relative time string
 */
export function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    
    if (interval >= 1) {
      return interval === 1
        ? `${interval} ${unit} ago`
        : `${interval} ${unit}s ago`;
    }
  }
  
  return 'just now';
}

/**
 * Format a market cap value with appropriate units
 * @param value - The market cap value in USD
 * @returns Formatted market cap string
 */
export function formatMarketCap(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return formatCurrency(value, 'USD', 0);
}

/**
 * Format a 24h volume with appropriate units
 * @param value - The 24h volume in USD
 * @returns Formatted volume string
 */
export function formatVolume24h(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return formatCurrency(value, 'USD', 0);
}
