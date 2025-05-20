const express = require('express');
const helmet = require('helmet');
const cookies = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// use cookies
app.use(cookies());

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: '50mb', strict: false }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '50mb', parameterLimit: 10000 }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(
  cors({
    origin: config.cors.regex,
    credentials: true,
  })
);
app.options('*', cors());

app.use('/v1', routes);

// Setup proxy to other services

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// Test function
// (async () => {
//   try {
//   } catch (error) {
//     console.log(error);
//   }
// })();

module.exports = app;
