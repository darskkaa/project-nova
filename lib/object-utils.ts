/**
 * Deep clone an object
 * @param obj - The object to clone
 * @returns A deep clone of the object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (obj instanceof Object) {
    const copy = {} as Record<string, any>;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = deepClone((obj as Record<string, any>)[key]);
      }
    }
    return copy as T;
  }
  
  return obj;
}

/**
 * Deep merge two objects
 * @param target - The target object
 * @param source - The source object
 * @returns A new object with properties from both objects
 */
export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const output = { ...target } as T & U;
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceKey = key as keyof U;
      const targetKey = key as keyof T;
      
      if (isObject(source[sourceKey])) {
        if (!(targetKey in target)) {
          Object.assign(output, { [key]: source[sourceKey] });
        } else {
          output[targetKey] = deepMerge(
            target[targetKey] as object,
            source[sourceKey] as object
          ) as any;
        }
      } else {
        Object.assign(output, { [key]: source[sourceKey] });
      }
    });
  }
  
  return output;
}

/**
 * Check if a value is an object
 * @param item - The value to check
 * @returns Boolean indicating if the value is an object
 */
export function isObject(item: any): item is object {
  return item !== null && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Pick specific properties from an object
 * @param obj - The source object
 * @param keys - Array of keys to pick
 * @returns A new object with only the picked properties
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}

/**
 * Omit specific properties from an object
 * @param obj - The source object
 * @param keys - Array of keys to omit
 * @returns A new object without the omitted properties
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * Get a nested property from an object using a path string
 * @param obj - The source object
 * @param path - The path to the property (e.g., 'user.profile.name')
 * @param defaultValue - Default value if the property doesn't exist
 * @returns The value at the specified path or the default value
 */
export function get(
  obj: Record<string, any>,
  path: string,
  defaultValue: any = undefined
): any {
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return defaultValue;
  }
  
  return result === undefined ? defaultValue : result;
}

/**
 * Set a nested property in an object using a path string
 * @param obj - The target object
 * @param path - The path to the property (e.g., 'user.profile.name')
 * @param value - The value to set
 * @returns A new object with the updated property
 */
export function set(
  obj: Record<string, any>,
  path: string,
  value: any
): Record<string, any> {
  if (!isObject(obj)) return obj;
  
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!isObject(current[key])) {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
}

/**
 * Check if an object is empty
 * @param obj - The object to check
 * @returns Boolean indicating if the object is empty
 */
export function isEmpty(obj: object): boolean {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
}

/**
 * Create an object from an array of key-value pairs
 * @param entries - Array of key-value pairs
 * @returns An object with the key-value pairs
 */
export function fromEntries<T = any>(
  entries: [string, T][]
): Record<string, T> {
  return entries.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, T>);
}

/**
 * Map over the values of an object
 * @param obj - The source object
 * @param fn - Function to transform each value
 * @returns A new object with transformed values
 */
export function mapValues<T, U>(
  obj: Record<string, T>,
  fn: (value: T, key: string, obj: Record<string, T>) => U
): Record<string, U> {
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = fn(obj[key], key, obj);
    return acc;
  }, {} as Record<string, U>);
}

/**
 * Map over the keys of an object
 * @param obj - The source object
 * @param fn - Function to transform each key
 * @returns A new object with transformed keys
 */
export function mapKeys<T>(
  obj: Record<string, T>,
  fn: (key: string, value: T, obj: Record<string, T>) => string
): Record<string, T> {
  return Object.keys(obj).reduce((acc, key) => {
    acc[fn(key, obj[key], obj)] = obj[key];
    return acc;
  }, {} as Record<string, T>);
}

/**
 * Filter object properties based on a predicate function
 * @param obj - The source object
 * @param predicate - Function that returns true for properties to keep
 * @returns A new object with filtered properties
 */
export function filterObject<T>(
  obj: Record<string, T>,
  predicate: (value: T, key: string, obj: Record<string, T>) => boolean
): Record<string, T> {
  return Object.keys(obj).reduce((acc, key) => {
    if (predicate(obj[key], key, obj)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Record<string, T>);
}

/**
 * Invert the keys and values of an object
 * @param obj - The source object
 * @returns A new object with keys and values swapped
 */
export function invert<T extends string | number | symbol>(
  obj: Record<string, T>
): Record<T, string> {
  return Object.keys(obj).reduce((acc, key) => {
    acc[obj[key]] = key;
    return acc;
  }, {} as Record<T, string>);
}

/**
 * Convert an object to a query string
 * @param obj - The object to convert
 * @returns A URL-encoded query string
 */
export function toQueryString(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  
  const process = (key: string, value: any) => {
    if (Array.isArray(value)) {
      value.forEach(item => process(`${key}[]`, item));
    } else if (isObject(value)) {
      Object.entries(value).forEach(([k, v]) => {
        process(`${key}[${k}]`, v);
      });
    } else if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  };
  
  Object.entries(obj).forEach(([key, value]) => {
    process(key, value);
  });
  
  return params.toString();
}

/**
 * Convert a query string to an object
 * @param queryString - The query string to convert
 * @returns An object with the query parameters
 */
export function fromQueryString(queryString: string): Record<string, any> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, any> = {};
  
  for (const [key, value] of params.entries()) {
    set(result, key, value);
  }
  
  return result;
}
