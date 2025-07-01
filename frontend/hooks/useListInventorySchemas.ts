// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use client';

import { getInventorySchemas } from '@/services/inventory.service';
import { useQuery } from '@tanstack/react-query';

const useListInventorySchemas = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['inventorySchemaList'],
    queryFn: async () => {
      const result = await getInventorySchemas();
      if (!result.success) {
        throw new Error(
          result.errorMessage || 'Failed to fetch inventory schemas'
        );
      }
      return result.result;
    },
    ...options,
  });
};

export default useListInventorySchemas;
