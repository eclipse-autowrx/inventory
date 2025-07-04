// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory Backend API Documentation',
    version,
    license: {
      name: 'CC-BY-4.0',
      url: 'https://github.com/eclipse-autowrx/inventory/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: `https://backend-core-dev.digital.auto/v2`,
      description: 'Production server',
    },
    {
      url: `http://localhost:${config.port}/v2`,
      description: 'Local server',
    },
    {
      url: `https://dev.backend-core-dev.digital.auto/v2`,
      description: 'Development server',
    },
  ],
};

/**
 * @type {import('swagger-jsdoc').Options}
 */
const options = {
  swaggerDefinition: swaggerDef,
  apis: [
    'src/routes/v2/schema.route.js',
    'src/routes/v2/instance.route.js',
    'src/routes/v2/relation.route.js',
    'src/routes/v2/instanceRelation.route.js',
    'src/routes/v2/changeLogs.route.js',
    'src/docs/*.yml',
  ],
};

module.exports = options;
