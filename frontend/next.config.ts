import type { NextConfig } from 'next';
import { URL } from 'url';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://bewebstudio.digitalauto.tech/**')],
  },
};

export default nextConfig;
