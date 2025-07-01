// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import { getInventoryInstances } from '@/services/inventory.service';
import { useQuery } from '@tanstack/react-query';

export default function useListInventoryInstances(params?: {
  schema?: string;
}) {
  const searchParams = new URLSearchParams(params);

  return useQuery({
    queryKey: ['listInventoryInstances', params],
    queryFn: async () => {
      const response = await getInventoryInstances(
        searchParams.size === 0 ? '' : searchParams.toString()
      );
      if (!response.success) {
        throw new Error(response.errorMessage || 'Failed to fetch instances');
      }
      return response.result;
    },
  });
}
