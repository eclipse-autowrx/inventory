// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

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
