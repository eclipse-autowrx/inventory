const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const { swaggerDocs } = require('../../docs/swagger');

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

module.exports = router;
