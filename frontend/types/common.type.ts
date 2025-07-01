// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

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
