// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

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
