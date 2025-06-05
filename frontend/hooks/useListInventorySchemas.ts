'use client';

import { getInventorySchemas } from '@/services/inventory.service';
import { useQuery } from '@tanstack/react-query';

const useListInventorySchemas = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['inventorySchemaList'],
    queryFn: () => getInventorySchemas(),
    ...options,
  });
};

export default useListInventorySchemas;
