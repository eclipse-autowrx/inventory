export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:9800',
  uploadFileUrl:
    process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:9800/v2/file',
};
