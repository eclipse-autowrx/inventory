// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import { CustomRequestInit } from '@/types/common.type';

export function apiFetch(url: string, options: CustomRequestInit = {}) {
  const { parseAsJson = true } = options;

  return fetch(url, {
    ...options,
    body:
      options.body && parseAsJson
        ? JSON.stringify(options.body)
        : typeof options.body === 'string'
          ? options.body
          : undefined,
    headers: {
      ...(parseAsJson ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
}
