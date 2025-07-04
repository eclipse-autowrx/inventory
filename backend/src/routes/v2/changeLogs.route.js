// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const express = require('express');
const validate = require('../../middlewares/validate');
const { injectJoiToSwagger } = require('../../docs/swagger');
const { authorizationClient } = require('../../config/authorizationClient');
const { changeLogsValidation } = require('../../validations');
const { changeLogsController } = require('../../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ChangeLogs
 *   description: API for querying change logs
 */

/**
 * @swagger
 * /inventory/change-logs:
 *   get:
 *     summary: Get all change logs
 *     tags: [ChangeLogs]
 *     responses:
 *       200:
 *         description: List of change logs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChangeLog'
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
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */
injectJoiToSwagger('/inventory/change-logs', 'get', changeLogsValidation.getChangeLogs);

router
  .route('/')
  .get(
    authorizationClient.checkPermissionByQuery('manageUsers'),
    validate(changeLogsValidation.getChangeLogs),
    changeLogsController.getChangeLogs,
  );

module.exports = router;
