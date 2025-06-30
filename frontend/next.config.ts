// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

import type { NextConfig } from 'next';
import { URL } from 'url';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://bewebstudio.digitalauto.tech/**')],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  output: 'standalone',
};

export default nextConfig;
