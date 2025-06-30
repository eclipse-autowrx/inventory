// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

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
