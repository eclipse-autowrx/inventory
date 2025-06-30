// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

const express = require('express');
const validate = require('../../middlewares/validate');
const schemaValidation = require('../../validations/schema.validation');
const schemaController = require('../../controllers/schema.controller');
const { injectJoiToSwagger } = require('../../docs/swagger');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Schemas
 *   description: API for managing schemas
 */

/**
 * @swagger
 * /inventory/schemas:
 *   post:
 *     summary: Create a new schema
 *     tags: [Schemas]
 *     responses:
 *       201:
 *         description: Schema created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schema'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
injectJoiToSwagger('/inventory/schemas', 'post', schemaValidation.createSchema);

/**
 * @swagger
 * /inventory/schemas:
 *   get:
 *     summary: Get all schemas
 *     tags: [Schemas]
 *     responses:
 *       200:
 *         description: List of schemas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Schema'
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalResults:
 *                   type: integer
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
injectJoiToSwagger('/inventory/schemas', 'get', schemaValidation.getSchemas);

/**
 * @swagger
 * /inventory/schemas/{schemaId}:
 *   get:
 *     summary: Get a schema by ID
 *     tags: [Schemas]
 *     responses:
 *       200:
 *         description: Schema details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schema'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger('/inventory/schemas/{schemaId}', 'get', schemaValidation.getSchema);

/**
 * @swagger
 * /inventory/schemas/{schemaId}:
 *   patch:
 *     summary: Update a schema
 *     tags: [Schemas]
 *     responses:
 *       200:
 *         description: Schema updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schema'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger('/inventory/schemas/{schemaId}', 'patch', schemaValidation.updateSchema);

/**
 * @swagger
 * /inventory/schemas/{schemaId}:
 *   delete:
 *     summary: Delete a schema
 *     tags: [Schemas]
 *     responses:
 *       204:
 *         description: Schema deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger('/inventory/schemas/{schemaId}', 'delete', schemaValidation.deleteSchema);

router
  .route('/')
  .post(validate(schemaValidation.createSchema), schemaController.createSchema)
  .get(validate(schemaValidation.getSchemas), schemaController.getSchemas);

router
  .route('/:schemaId')
  .get(validate(schemaValidation.getSchema), schemaController.getSchema)
  .patch(validate(schemaValidation.updateSchema), schemaController.updateSchema)
  .delete(validate(schemaValidation.deleteSchema), schemaController.deleteSchema);

module.exports = router;
