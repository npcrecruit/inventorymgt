// src/hooks/useApi.ts
import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import type { ApiError } from '../types/common';  // Updated import path

interface ApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const { showNotification } = useNotification();

  async function callApi<T>(
    apiFunction: () => Promise<T>,
    options: ApiOptions<T> = {}
  ): Promise<T | null> {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage = 'An error occurred'
    } = options;

    setLoading(true);
    setError(null);

    try {
      const data = await apiFunction();
      if (successMessage) {
        showNotification(successMessage, 'success');
      }
      onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err as ApiError;
      setError(error);
      showNotification(errorMessage, 'error');
      onError?.(error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, callApi };
}