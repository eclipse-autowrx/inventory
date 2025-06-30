// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

const { newAuthorizationClient } = require('../utils/authorizationClientUtil');
const config = require('./config');
const logger = require('./logger');

const authorizationClient = newAuthorizationClient(config.services.auth.authorizationUrl, logger);

module.exports.authorizationClient = authorizationClient;
