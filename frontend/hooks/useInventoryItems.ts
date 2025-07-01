// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

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
