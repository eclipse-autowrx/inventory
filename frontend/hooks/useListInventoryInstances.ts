import { getInventoryInstances } from '@/services/inventory.service';
import { useQuery } from '@tanstack/react-query';

export default function useListInventoryInstances(params?: {
  schema?: string;
}) {
  const searchParams = new URLSearchParams(params);

  return useQuery({
    queryKey: ['listInventoryInstances', params],
    queryFn: () =>
      getInventoryInstances(
        searchParams.size === 0 ? '' : searchParams.toString()
      ),
  });
}
