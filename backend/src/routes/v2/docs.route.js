// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const { swaggerDocs } = require('../../docs/swagger');

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

module.exports = router;
