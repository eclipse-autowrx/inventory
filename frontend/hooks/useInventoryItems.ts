import { instances } from '@/lib/mock/data';
import { useQuery } from '@tanstack/react-query';

const useInventoryItems = () => {
  return useQuery({
    queryKey: ['inventoryItems'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return instances;
    },
  });
};

export default useInventoryItems;
