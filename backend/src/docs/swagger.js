// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

const j2s = require('joi-to-swagger');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDef = require('./swaggerDef');
const swaggerDocs = swaggerJsDoc(swaggerDef);

// Set global security using bearerAuth for all endpoints
swaggerDocs.security = [
  {
    bearerAuth: [],
  },
];

const injectJoiToSwagger = (path, method, schema) => {
  if (!swaggerDocs.paths[path]) {
    swaggerDocs.paths[path] = {};
  }

  const parameters = [];
  const requestBody = {};

  if (schema.params) {
    const { swagger: swaggerParams } = j2s(schema.params);
    parameters.push(
      ...Object.keys(swaggerParams.properties).map((key) => ({
        name: key,
        in: 'path',
        required: swaggerParams.required?.includes(key),
        schema: swaggerParams.properties[key],
      })),
    );
  }

  if (schema.query) {
    const { swagger: swaggerQuery } = j2s(schema.query);
    parameters.push(
      ...Object.keys(swaggerQuery.properties).map((key) => ({
        name: key,
        in: 'query',
        required: swaggerQuery.required?.includes(key),
        schema: swaggerQuery.properties[key],
      })),
    );
  }

  if (schema.body) {
    const { swagger: swaggerBody } = j2s(schema.body);
    requestBody.content = {
      'application/json': {
        schema: swaggerBody,
      },
    };
  }

  if (parameters.length > 0) {
    swaggerDocs.paths[path][method] = {
      ...swaggerDocs.paths[path][method],
      parameters,
    };
  }

  if (requestBody.content) {
    swaggerDocs.paths[path][method] = {
      ...swaggerDocs.paths[path][method],
      requestBody,
    };
  }
};

module.exports = { swaggerDocs, injectJoiToSwagger };
