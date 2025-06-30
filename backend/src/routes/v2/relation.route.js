// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

const express = require('express');
const validate = require('../../middlewares/validate');
const relationValidation = require('../../validations/relation.validation');
const relationController = require('../../controllers/relation.controller');
const { injectJoiToSwagger } = require('../../docs/swagger');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Relations
 *   description: API for managing relations
 */

/**
 * @swagger
 * /inventory/relations:
 *   post:
 *     summary: Create a new relation
 *     tags: [Relations]
 *     responses:
 *       201:
 *         description: Relation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Relation'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
injectJoiToSwagger('/inventory/relations', 'post', relationValidation.createRelation);

/**
 * @swagger
 * /inventory/relations:
 *   get:
 *     summary: Get all relations
 *     tags: [Relations]
 *     responses:
 *       200:
 *         description: List of relations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Relation'
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
injectJoiToSwagger('/inventory/relations', 'get', relationValidation.getRelations);

/**
 * @swagger
 * /inventory/relations/{relationId}:
 *   get:
 *     summary: Get a relation by ID
 *     tags: [Relations]
 *     responses:
 *       200:
 *         description: Relation details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Relation'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger('/inventory/relations/{relationId}', 'get', relationValidation.getRelation);

/**
 * @swagger
 * /inventory/relations/{relationId}:
 *   patch:
 *     summary: Update a relation
 *     tags: [Relations]
 *     responses:
 *       200:
 *         description: Relation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Relation'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger('/inventory/relations/{relationId}', 'patch', relationValidation.updateRelation);

/**
 * @swagger
 * /inventory/relations/{relationId}:
 *   delete:
 *     summary: Delete a relation
 *     tags: [Relations]
 *     responses:
 *       204:
 *         description: Relation deleted successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
injectJoiToSwagger('/inventory/relations/{relationId}', 'delete', relationValidation.deleteRelation);

router
  .route('/')
  .post(validate(relationValidation.createRelation), relationController.createRelation)
  .get(validate(relationValidation.getRelations), relationController.getRelations);

router
  .route('/:relationId')
  .get(validate(relationValidation.getRelation), relationController.getRelation)
  .patch(validate(relationValidation.updateRelation), relationController.updateRelation)
  .delete(validate(relationValidation.deleteRelation), relationController.deleteRelation);

module.exports = router;
