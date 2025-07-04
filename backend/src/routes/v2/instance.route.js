// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const express = require('express');
const validate = require('../../middlewares/validate');
const instanceValidation = require('../../validations/instance.validation');
const instanceController = require('../../controllers/instance.controller');
const { injectJoiToSwagger } = require('../../docs/swagger');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Instances
 *   description: API for managing instances
 *   x-order: 1
 */

/**
 * @swagger
 * /inventory/instances:
 *   post:
 *     summary: Create a new instance
 *     tags: [Instances]
 *     responses:
 *       201:
 *         description: Instance created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instance'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
injectJoiToSwagger('/inventory/instances', 'post', instanceValidation.createInstance);

/**
 * @swagger
 * /inventory/instances:
 *   get:
 *     summary: Get all instances
 *     tags: [Instances]
 *     responses:
 *       200:
 *         description: List of instances
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Instance'
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
injectJoiToSwagger('/inventory/instances', 'get', instanceValidation.getInstances);

/**
 * @swagger
 * /inventory/instances/{instanceId}:
 *   get:
 *     summary: Get an instance by ID
 *     tags: [Instances]
 *     responses:
 *       200:
 *         description: Instance details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instance'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger('/inventory/instances/{instanceId}', 'get', instanceValidation.getInstance);

/**
 * @swagger
 * /inventory/instances/{instanceId}:
 *   patch:
 *     summary: Update an instance
 *     tags: [Instances]
 *     responses:
 *       200:
 *         description: Instance updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instance'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger('/inventory/instances/{instanceId}', 'patch', instanceValidation.updateInstance);

/**
 * @swagger
 * /inventory/instances/{instanceId}:
 *   delete:
 *     summary: Delete an instance
 *     tags: [Instances]
 *     responses:
 *       204:
 *         description: Instance deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger('/inventory/instances/{instanceId}', 'delete', instanceValidation.deleteInstance);

router
  .route('/')
  .post(validate(instanceValidation.createInstance), instanceController.createInstance)
  .get(validate(instanceValidation.getInstances), instanceController.getInstances);

router
  .route('/:instanceId')
  .get(validate(instanceValidation.getInstance), instanceController.getInstance)
  .patch(validate(instanceValidation.updateInstance), instanceController.updateInstance)
  .delete(validate(instanceValidation.deleteInstance), instanceController.deleteInstance);

module.exports = router;
