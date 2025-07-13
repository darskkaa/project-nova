import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T = any>(
  url: string,
  method: HttpMethod = 'GET',
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (body?: any, customUrl?: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const requestUrl = customUrl || url;
        const response = await fetch(requestUrl, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        setData(responseData);

        if (options.onSuccess) {
          options.onSuccess(responseData);
        }

        if (options.successMessage) {
          toast({
            title: 'Success',
            description: options.successMessage,
            variant: 'default',
          });
        }

        return responseData;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An unknown error occurred');
        setError(error);

        if (options.onError) {
          options.onError(error);
        }

        toast({
          title: 'Error',
          description: options.errorMessage || error.message,
          variant: 'destructive',
        });

        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [url, method, options]
  );

  return { data, error, isLoading, execute };
}
