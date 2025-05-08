import axios from 'axios';
import { apiConfig } from '@/configs/api';

const UPLOAD_FILE_URL = apiConfig.uploadFileUrl;

export const uploadFileService = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return (
    await axios.post<{ url: string }>(
      `${UPLOAD_FILE_URL}/upload/store-be`,
      formData
    )
  ).data;
};
