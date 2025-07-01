// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

export const apiConfig = {
  baseUrl:
    process.env.NEXT_PUBLIC_SERVER_BASE_URL ||
    'https://backend-core-dev.digital.auto/v2',
  uploadFileUrl:
    process.env.NEXT_PUBLIC_UPLOAD_URL ||
    'https://backend-core-dev.digital.auto/v2/file',
  cacheBaseUrl:
    process.env.NEXT_PUBLIC_CACHE_BASE_URL || 'http://cache.digitalauto.tech',
  logBaseUrl: process.env.NEXT_PUBLIC_LOG_BASE_URL || 'http://log.digital.auto',
};
