// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

// import { listUsersService } from '@/services/user.service';
import { InfiniteListQueryParams } from '@/types/common.type';
import { User } from '@/types/user.type';
// import { useInfiniteQuery } from '@tanstack/react-query';
// import { useMemo } from 'react';
// import { useSearchParams } from 'next/navigation';

export const useListUsers = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  params?: Partial<
    Record<
      keyof (User & InfiniteListQueryParams & { includeFullDetails?: boolean }),
      unknown
    >
  >
): { data: Partial<User>[] } => {
  // const searchParams = useSearchParams();
  // const search = searchParams.get('search') || '';

  // if (search) {
  //   params = {
  //     search,
  //     ...params,
  //   };
  // }

  // const { data: originalData, ...rest } = useInfiniteQuery({
  //   queryKey: ['listUsers', params],
  //   queryFn: ({ pageParam }) =>
  //     listUsersService({ ...params, page: pageParam }),
  //   getNextPageParam: (lastPage) => {
  //     if (lastPage.page < lastPage.totalPages) {
  //       return lastPage.page + 1;
  //     }
  //     return undefined;
  //   },
  //   initialPageParam: 1,
  // });

  // const data = useMemo(
  //   () => originalData?.pages.flatMap((page) => page.results) || [],
  //   [originalData]
  // );

  // return {
  //   data,
  //   originalData,
  //   totalResults: originalData?.pages.at(0)?.totalResults || 0,
  //   ...rest,
  // };
  return {
    data: [
      {
        name: 'Luong Nguyen Nhan (MS/PJ-ETA-Innov)',
        image_file:
          'https://backend-core-dev.digital.auto/v2/file/data/autowrx/5a4e8b26-66a1-4cfd-9c22-c16150b17739.jpg',
        id: '6699fa83964f3f002f35ea03',
      },
      {
        name: 'Phan Thanh Hoang (MS/ETA-Hub MS/ETA-DAP)',
        image_file:
          'https://backend-core-dev.digital.auto/v2/file/data/autowrx/209ec591-ccd1-48db-bb23-6437444e84d2.jpg',
        id: '6714fe1a9c8a740026eb7f97',
      },
      {
        name: 'Slama Dirk (G7/PJ-DO-SPP)',
        image_file:
          'https://backend-core-dev.digital.auto/v2/file/data/autowrx/7d0ff6e1-e5a3-4cf9-bd43-549f8593dd47.jpg',
        id: '6724a8cb3e09ac00279ed6f5',
      },
    ],
  };
};
