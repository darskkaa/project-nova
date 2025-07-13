/**
 * Truncate a string to a specified length and add an ellipsis if it exceeds the length
 * @param str - The string to truncate
 * @param maxLength - Maximum length before truncation
 * @param ellipsis - The ellipsis string to append (default: '...')
 * @returns Truncated string with ellipsis if needed
 */
export function truncate(str: string, maxLength: number, ellipsis: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + ellipsis;
}

/**
 * Convert a string to title case
 * @param str - The string to convert
 * @returns String in title case
 */
export function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert a string to kebab-case
 * @param str - The string to convert
 * @returns kebab-cased string
 */
export function toKebabCase(str: string): string {
  if (!str) return '';
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    .join('-') || '';
}

/**
 * Convert a string to camelCase
 * @param str - The string to convert
 * @returns camelCased string
 */
export function toCamelCase(str: string): string {
  if (!str) return '';
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
      return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/[\s-]+/g, '');
}

/**
 * Convert a string to PascalCase
 * @param str - The string to convert
 * @returns PascalCased string
 */
export function toPascalCase(str: string): string {
  if (!str) return '';
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
    .join('') || '';
}

/**
 * Convert a string to snake_case
 * @param str - The string to convert
 * @returns snake_cased string
 */
export function toSnakeCase(str: string): string {
  if (!str) return '';
  return str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map(x => x.toLowerCase())
    .join('_') || '';
}

/**
 * Remove all whitespace from a string
 * @param str - The string to process
 * @returns String with all whitespace removed
 */
export function removeWhitespace(str: string): string {
  if (!str) return '';
  return str.replace(/\s+/g, '');
}

/**
 * Check if a string is a valid email address
 * @param email - The email address to validate
 * @returns Boolean indicating if the email is valid
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Check if a string is a valid URL
 * @param url - The URL to validate
 * @returns Boolean indicating if the URL is valid
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Generate a random string of specified length
 * @param length - Length of the random string
 * @param chars - Character set to use (default: alphanumeric)
 * @returns Random string
 */
export function randomString(
  length: number = 10,
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  let result = '';
  const charsLength = chars.length;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  
  return result;
}

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns String with first letter capitalized
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Remove HTML tags from a string
 * @param html - The HTML string to process
 * @returns String with HTML tags removed
 */
export function stripHtmlTags(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
}

/**
 * Count the number of words in a string
 * @param str - The string to count words in
 * @returns Number of words
 */
export function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Generate a slug from a string
 * @param str - The string to convert to a slug
 * @returns URL-friendly slug
 */
export function slugify(str: string): string {
  if (!str) return '';
  
  return str
    .toString()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .trim()
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with -
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing -
}

/**
 * Mask sensitive information in a string (e.g., email, credit card)
 * @param str - The string to mask
 * @param visibleChars - Number of characters to keep visible at start/end (default: 3)
 * @param maskChar - Character to use for masking (default: '*')
 * @returns Masked string
 */
export function maskString(
  str: string,
  visibleChars: number = 3,
  maskChar: string = '*'
): string {
  if (!str) return '';
  
  const length = str.length;
  if (length <= visibleChars * 2) {
    return maskChar.repeat(length);
  }
  
  const firstPart = str.substring(0, visibleChars);
  const lastPart = str.substring(length - visibleChars);
  const maskedPart = maskChar.repeat(Math.max(0, length - visibleChars * 2));
  
  return `${firstPart}${maskedPart}${lastPart}`;
}
