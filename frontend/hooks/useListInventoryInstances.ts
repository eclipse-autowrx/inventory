// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

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
