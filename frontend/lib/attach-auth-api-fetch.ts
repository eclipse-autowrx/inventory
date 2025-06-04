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
