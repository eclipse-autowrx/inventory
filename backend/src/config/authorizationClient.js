// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const { newAuthorizationClient } = require('../utils/authorizationClientUtil');
const config = require('./config');
const logger = require('./logger');

const authorizationClient = newAuthorizationClient(config.services.auth.authorizationUrl, logger);

module.exports.authorizationClient = authorizationClient;
