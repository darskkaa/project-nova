/**
 * Remove duplicate objects from an array based on a unique key
 * @param arr - The array to deduplicate
 * @param key - The key to check for uniqueness
 * @returns Deduplicated array
 */
export function deduplicateByKey<T extends Record<string, any>>(
  arr: T[], 
  key: keyof T
): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Group an array of objects by a specific key
 * @param arr - The array to group
 * @param key - The key to group by
 * @returns Object with keys as the grouped values and values as arrays of items
 */
export function groupBy<T extends Record<string, any>, K extends keyof T>(
  arr: T[], 
  key: K
): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

/**
 * Sort an array of objects by a specific key
 * @param arr - The array to sort
 * @param key - The key to sort by
 * @param order - Sort order ('asc' or 'desc', default: 'asc')
 * @returns Sorted array
 */
export function sortBy<T extends Record<string, any>>(
  arr: T[], 
  key: keyof T, 
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Chunk an array into smaller arrays of a specified size
 * @param arr - The array to chunk
 * @param size - The size of each chunk
 * @returns Array of chunks
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * @param arr - The array to shuffle
 * @returns A new shuffled array
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

/**
 * Get unique values from an array
 * @param arr - The array to get unique values from
 * @returns Array of unique values
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

/**
 * Get the difference between two arrays
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Array of elements that are in arr1 but not in arr2
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2);
  return arr1.filter(x => !set2.has(x));
}

/**
 * Get the intersection of two arrays
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Array of elements that are in both arrays
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2);
  return arr1.filter(x => set2.has(x));
}

/**
 * Get the union of multiple arrays
 * @param arrays - Arrays to union
 * @returns Array of unique elements from all arrays
 */
export function union<T>(...arrays: T[][]): T[] {
  return Array.from(new Set(arrays.flat()));
}

/**
 * Flatten a nested array
 * @param arr - The array to flatten
 * @returns Flattened array
 */
export function flatten<T>(arr: any[]): T[] {
  return arr.flat(Infinity) as T[];
}

/**
 * Find the index of the maximum value in an array
 * @param arr - The array to search
 * @returns Index of the maximum value, or -1 if array is empty
 */
export function findMaxIndex(arr: number[]): number {
  if (arr.length === 0) return -1;
  return arr.reduce((maxIndex, current, currentIndex) => {
    return current > arr[maxIndex] ? currentIndex : maxIndex;
  }, 0);
}

/**
 * Find the index of the minimum value in an array
 * @param arr - The array to search
 * @returns Index of the minimum value, or -1 if array is empty
 */
export function findMinIndex(arr: number[]): number {
  if (arr.length === 0) return -1;
  return arr.reduce((minIndex, current, currentIndex) => {
    return current < arr[minIndex] ? currentIndex : minIndex;
  }, 0);
}

/**
 * Calculate the sum of an array of numbers
 * @param arr - Array of numbers
 * @returns The sum of all numbers in the array
 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculate the average of an array of numbers
 * @param arr - Array of numbers
 * @returns The average of all numbers in the array
 */
export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

/**
 * Partition an array into two arrays based on a predicate function
 * @param arr - The array to partition
 * @param predicate - Function that returns true for elements that should be in the first array
 * @returns A tuple with two arrays: [elementsThatPassed, elementsThatFailed]
 */
export function partition<T>(
  arr: T[], 
  predicate: (item: T) => boolean
): [T[], T[]] {
  return arr.reduce<[T[], T[]]>(
    (acc, item) => {
      acc[predicate(item) ? 0 : 1].push(item);
      return acc;
    },
    [[], []]
  );
}

/**
 * Create an array of a specified length filled with a value or generated by a function
 * @param length - The length of the array to create
 * @param fill - A value or function to fill the array with
 * @returns The created array
 */
export function createArray<T>(
  length: number, 
  fill: T | ((index: number) => T)
): T[] {
  return Array.from(
    { length },
    typeof fill === 'function' 
      ? (_, i) => (fill as (i: number) => T)(i)
      : () => fill
  );
}
