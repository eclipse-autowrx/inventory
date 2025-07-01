// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import { useParams } from 'next/navigation';
import { instances, roles } from '@/lib/mock/data';
import { InventoryItem } from '@/types/inventory.type';
import { useListUsers } from './useListUsers';
import { useMemo } from 'react';

type Result = {
  data: {
    inventoryItem: InventoryItem | null;
    roleData: Record<string, unknown> | null;
  };
};

const hashStr = (s: string) => {
  let hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

const useCurrentInventoryData = () => {
  const { slug, inventory_role } = useParams();
  const id = slug?.at(0);
  const { data: users } = useListUsers({
    id: '6724a8cb3e09ac00279ed6f5,6714fe1a9c8a740026eb7f97,6699fa83964f3f002f35ea03',
  });

  return useMemo(() => {
    const ret: Result = {
      data: {
        inventoryItem: null,
        roleData: null,
      },
    };

    if (id) {
      ret.data.inventoryItem =
        instances.find((instance) => instance.id === id) || null;
      if (ret.data.inventoryItem?.data) {
        ret.data.inventoryItem.data.createdBy = users.at(
          hashStr(Array.isArray(id) ? id[0] : id) % (users.length || 1)
        );
      }
    }

    if (inventory_role) {
      ret.data.roleData =
        roles.find((role) => role.name === inventory_role) || null;
    }

    return ret;
  }, [id, inventory_role, users]);
};

export default useCurrentInventoryData;
