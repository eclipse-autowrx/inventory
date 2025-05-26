const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3001),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    // CORS Settings
    CORS_ORIGIN: Joi.string().description('CORS regex'),
    AUTHORIZATION_URL: Joi.string()
      .default('http://playground-be:8080/v2/auth/authorize')
      .description('Authorization service URL'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  cors: {
    regex: (envVars.CORS_ORIGIN || 'localhost:\\d+,127\\.0\\.0\\.1:\\d+')
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean)
      // eslint-disable-next-line security/detect-non-literal-regexp
      .map((i) => new RegExp(i)),
  },
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  constraints: {
    defaultPageSize: 100,
  },
  services: {
    auth: {
      authorizationUrl: envVars.AUTHORIZATION_URL,
    },
  },
};

module.exports = config;
