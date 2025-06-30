// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

const { default: axios } = require('axios');
const config = require('./config');

const logAxios = axios.create({
  baseURL: config.services.log.url,
});

module.exports = { logAxios };
