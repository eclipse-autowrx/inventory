// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use server';

import { CustomRequestInit } from '@/types/common.type';
import { getServerSession } from './auth/server-session-auth';
import { apiFetch } from './api-fetch';

export async function attachAuthApiFetch(
  url: string,
  options: CustomRequestInit = {}
) {
  const session = await getServerSession();
  const token = session?.accessToken;
  return apiFetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });
}
