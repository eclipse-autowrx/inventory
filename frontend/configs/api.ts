export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:9800',
  uploadFileUrl:
    process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:9800/v2/file',
  cacheBaseUrl:
    process.env.NEXT_PUBLIC_CACHE_BASE_URL || 'http://cache.digitalauto.tech',
  logBaseUrl: process.env.NEXT_PUBLIC_LOG_BASE_URL || 'http://log.digital.auto',
};
