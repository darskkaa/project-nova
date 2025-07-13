/**
 * Format a date string or timestamp to a human-readable format
 * @param date - Date string or timestamp
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
    
  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format a timestamp as a relative time (e.g., "2 hours ago")
 * @param timestamp - The timestamp in milliseconds
 * @returns Relative time string
 */
export function timeAgo(timestamp: number): string {
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
 * Format a duration in milliseconds to a human-readable format
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Get the start of the day for a given date
 * @param date - The date
 * @returns Start of the day as a Date object
 */
export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get the end of the day for a given date
 * @param date - The date
 * @returns End of the day as a Date object
 */
export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Format a date range as a string
 * @param startDate - Start date
 * @param endDate - End date (defaults to now)
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date | string | number,
  endDate: Date | string | number = new Date()
): string {
  const start = typeof startDate === 'object' ? startDate : new Date(startDate);
  const end = typeof endDate === 'object' ? endDate : new Date(endDate);
  
  const startStr = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  
  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  return `${startStr} - ${endStr}`;
}

/**
 * Check if a date is today
 * @param date - The date to check
 * @returns Boolean indicating if the date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is yesterday
 * @param date - The date to check
 * @returns Boolean indicating if the date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Format a date as a short relative time (e.g., "2h ago", "3d ago")
 * @param date - The date
 * @returns Short relative time string
 */
export function shortTimeAgo(date: Date | string | number): string {
  const d = typeof date === 'object' ? date : new Date(date);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  
  const intervals = {
    y: 31536000,
    mo: 2592000,
    w: 604800,
    d: 86400,
    h: 3600,
    m: 60,
    s: 1,
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    
    if (interval >= 1) {
      return `${interval}${unit} ago`;
    }
  }
  
  return 'just now';
}
