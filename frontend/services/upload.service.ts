// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

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
