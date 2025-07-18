// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: (failureCount, error) => {
        if (isAxiosError(error) && error?.response?.status === 401) {
          return false;
        }

        return failureCount <= 1;
      },
    },
  },
  // queryCache: new QueryCache({
  //   onError: async (error, query) => {
  //     if (isAxiosError(error) && error?.response?.status === 401) {
  //       try {
  //         await refreshAuthToken();
  //         queryClient.invalidateQueries({ queryKey: query.queryKey });
  //       } catch (error) {
  //         console.error('Error refreshing token', error);
  //       }
  //     }
  //   },
  // }),
});

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
