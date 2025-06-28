const { version } = require('../../package.json');
const config = require('../config/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory Backend API Documentation',
    version,
    license: {
      name: 'CC-BY-4.0',
      url: 'https://github.com/eclipse-autowrx/inventory/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: `https://backend-core-dev.digital.auto/v2`,
      description: 'Production server',
    },
    {
      url: `http://localhost:${config.port}/v2`,
      description: 'Local server',
    },
    {
      url: `https://dev.backend-core-dev.digital.auto/v2`,
      description: 'Development server',
    },
  ],
};

/**
 * @type {import('swagger-jsdoc').Options}
 */
const options = {
  swaggerDefinition: swaggerDef,
  apis: ['src/routes/**/*.js', 'src/docs/*.yml'],
};

module.exports = options;
