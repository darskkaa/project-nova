/**
 * Handles API errors consistently across the application
 * @param error The error object or message
 * @param context Additional context about where the error occurred
 * @returns A standardized error object
 */
export function handleApiError(error: unknown, context: string = '') {
  let errorMessage = 'An unknown error occurred';
  let statusCode = 500;

  if (error instanceof Error) {
    console.error(`[${context}] ${error.message}`, error);
    errorMessage = error.message;
    
    // Handle specific error types
    if (error.name === 'AxiosError') {
      const axiosError = error as any;
      statusCode = axiosError.response?.status || 500;
      errorMessage = axiosError.response?.data?.error?.message || errorMessage;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  return {
    success: false,
    error: errorMessage,
    status: statusCode,
    context,
  };
}

/**
 * Formats a number as a currency string
 * @param value The number to format
 * @param currency The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(value);
}

/**
 * Formats a large number with appropriate suffix (K, M, B, T)
 * @param num The number to format
 * @param decimals Number of decimal places to show
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
 * Debounce a function call
 * @param func The function to debounce
 * @param wait Time to wait in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Creates a mock response for development/testing when API is not available
 * @param data The data to return
 * @param delay Delay in milliseconds (default: 500ms)
 * @returns A promise that resolves with the data after the delay
 */
export function mockResponse<T>(data: T, delay: number = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
}
