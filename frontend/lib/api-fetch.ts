import { CustomRequestInit } from '@/types/common.type';

export function apiFetch(url: string, options: CustomRequestInit = {}) {
  const { parseAsJson = true } = options;

  return fetch(url, {
    ...options,
    body:
      options.body && parseAsJson ? JSON.stringify(options.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}
