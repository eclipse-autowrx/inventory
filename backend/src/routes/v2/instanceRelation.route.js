// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

const express = require('express');
const validate = require('../../middlewares/validate');
const instanceRelationValidation = require('../../validations/instanceRelation.validation');
const instanceRelationController = require('../../controllers/instanceRelation.controller');
const { injectJoiToSwagger } = require('../../docs/swagger');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: InstanceRelations
 *   description: API for managing instance relations
 */

/**
 * @swagger
 * /inventory/instance-relations:
 *   post:
 *     summary: Create a new instance relation
 *     tags: [InstanceRelations]
 *     responses:
 *       201:
 *         description: Instance relation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstanceRelation'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
injectJoiToSwagger('/inventory/instance-relations', 'post', instanceRelationValidation.createInstanceRelation);

/**
 * @swagger
 * /inventory/instance-relations:
 *   get:
 *     summary: Get all instance relations
 *     tags: [InstanceRelations]
 *     responses:
 *       200:
 *         description: List of instance relations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InstanceRelation'
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
injectJoiToSwagger('/inventory/instance-relations', 'get', instanceRelationValidation.getInstanceRelations);

/**
 * @swagger
 * /inventory/instance-relations/{instanceRelationId}:
 *   get:
 *     summary: Get an instance relation by ID
 *     tags: [InstanceRelations]
 *     responses:
 *       200:
 *         description: Instance relation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstanceRelation'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger(
  '/inventory/instance-relations/{instanceRelationId}',
  'get',
  instanceRelationValidation.getInstanceRelation,
);

/**
 * @swagger
 * /inventory/instance-relations/{instanceRelationId}:
 *   patch:
 *     summary: Update an instance relation
 *     tags: [InstanceRelations]
 *     responses:
 *       200:
 *         description: Instance relation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstanceRelation'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger(
  '/inventory/instance-relations/{instanceRelationId}',
  'patch',
  instanceRelationValidation.updateInstanceRelation,
);

/**
 * @swagger
 * /inventory/instance-relations/{instanceRelationId}:
 *   delete:
 *     summary: Delete an instance relation
 *     tags: [InstanceRelations]
 *     responses:
 *       204:
 *         description: Instance relation deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger(
  '/inventory/instance-relations/{instanceRelationId}',
  'delete',
  instanceRelationValidation.deleteInstanceRelation,
);

router
  .route('/')
  .post(validate(instanceRelationValidation.createInstanceRelation), instanceRelationController.createInstanceRelation)
  .get(validate(instanceRelationValidation.getInstanceRelations), instanceRelationController.getInstanceRelations);

router
  .route('/:instanceRelationId')
  .get(validate(instanceRelationValidation.getInstanceRelation), instanceRelationController.getInstanceRelation)
  .patch(validate(instanceRelationValidation.updateInstanceRelation), instanceRelationController.updateInstanceRelation)
  .delete(validate(instanceRelationValidation.deleteInstanceRelation), instanceRelationController.deleteInstanceRelation);

module.exports = router;
