const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('../../docs/swaggerDef');

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const router = Router();

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));

module.exports = router;
