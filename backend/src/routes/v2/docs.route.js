// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const { swaggerDocs } = require('../../docs/swagger');

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

module.exports = router;
