// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

export type List<T> = {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type ListQueryParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  search?: string;
};

export type InfiniteListQueryParams = Omit<ListQueryParams, 'page'>;

export type Partner = {
  title: string;
  items: {
    name: string;
    img: string;
    url: string;
  }[];
};

export type CustomRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown;
  parseAsJson?: boolean;
};
