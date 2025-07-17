// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3001),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    AUTHORIZATION_URL: Joi.string()
      .default('http://playground-be:8080/v2/auth/authorize')
      .description('Authorization service URL'),
    LOGS_MAX_SIZE: Joi.number().default(100).description('Max size of change logs in MB'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  constraints: {
    defaultPageSize: 100,
  },
  services: {
    auth: {
      authorizationUrl: envVars.AUTHORIZATION_URL,
    },
    user: {
      url: 'http://playground-be:8080/v2/users',
    },
  },
  logsMaxSize: envVars.LOGS_MAX_SIZE,
};

module.exports = config;
