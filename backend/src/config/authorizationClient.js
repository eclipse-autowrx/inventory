const { newAuthorizationClient } = require('../utils/authorizationClientUtil');
const config = require('./config');
const logger = require('./logger');

const authorizationClient = newAuthorizationClient(config.services.auth.authorizationUrl, logger);

module.exports.authorizationClient = authorizationClient;
