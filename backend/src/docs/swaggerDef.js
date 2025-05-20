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
      url: `http://localhost:${config.port}/v2`,
    },
  ],
};

const options = {
  swaggerDefinition: swaggerDef,
  apis: ['./src/routes/v2/*.js', './src/models/*.model.js'],
};

module.exports = options;
