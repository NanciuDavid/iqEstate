import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on authentication errors
        if (error instanceof Error && error.message.includes('Authentication required')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
}); 