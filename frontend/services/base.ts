// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import { apiConfig } from '@/configs/api';
// import useAuthStore from '@/stores/authStore';
import axios from 'axios';

export const serverAxios = axios.create({
  baseURL: `${apiConfig.baseUrl}/v2`,
  withCredentials: true,
});

export const cacheAxios = axios.create({
  baseURL: apiConfig.cacheBaseUrl,
});

// serverAxios.interceptors.request.use(
//   (config) => {
//     const token = useAuthStore.getState().access?.token;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export const logAxios = axios.create({
  baseURL: apiConfig.logBaseUrl,
  withCredentials: true,
});
