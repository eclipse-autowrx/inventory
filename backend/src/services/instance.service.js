// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const httpStatus = require('http-status');
const Ajv = require('ajv');
const { Instance, Schema } = require('../models');
const ApiError = require('../utils/ApiError');

const schemaService = require('./schema.service');
const ParsedJsonPropertiesMongooseDecorator = require('../decorators/ParsedJsonPropertiesMongooseDecorator');
const ParsedJsonPropertiesMongooseListDecorator = require('../decorators/ParsedJsonPropertiesMongooseListDecorator');
const { buildMongoSearchFilter } = require('../utils/queryUtils');
const InterservicePopulateListDecorator = require('../decorators/InterservicePopulateDecorator');
const { authorizationClient } = require('../config/authorizationClient');

/**
 * Validate instance data against its schema definition
 * @param {ObjectId} schemaId
 * @param {string} data
 */
const validateDataAgainstSchema = async (schemaId, data) => {
  const ajv = new Ajv();
  const schema = await Schema.findById(schemaId);
  if (!schema) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Schema with id ${schemaId} not found for validation`);
  }

  let parsedSchemaDefinition;
  try {
    parsedSchemaDefinition = JSON.parse(schema.schema_definition);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Schema definition parsing error: ${error.message}`);
  }

  let parsedInstanceData;
  try {
    parsedInstanceData = JSON.parse(data);
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Instance data parsing error: ${error.message}`);
  }

  try {
    const validate = ajv.compile(parsedSchemaDefinition);
    const valid = validate(parsedInstanceData);
    if (!valid) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Data validation error: ${ajv.errorsText(validate.errors)}`);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof Ajv.ValidationError) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Schema validation error: ${error.message}`);
    }
    throw new ApiError(httpStatus.BAD_REQUEST, `Schema validation error: ${error.message}`);
  }
};

/**
 * Create an instance
 * @param {Object} instanceBody
 * @param {string} userId
 * @returns {Promise<Instance>}
 */
const createInstance = async (instanceBody, userId) => {
  // 1. Validate data against the schema
  await validateDataAgainstSchema(instanceBody.schema, instanceBody.data);

  // 2. Create the instance
  const instance = await Instance.create({
    ...instanceBody,
    created_by: userId,
  });
  return instance;
};

/**
 * Query for instances
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} [advanced] - Advanced options
 * @returns {Promise<QueryResult>}
 */
const queryInstances = async (filter = {}, options = {}, advanced = {}) => {
  const finalOptions = { ...options };
  if (!finalOptions.populate) {
    // Need wrapping array because of spread operator in paginate.plugin logic
    finalOptions.populate = [
      [
        {
          path: 'schema',
          select: 'name',
        },
      ],
    ];
  }
  const finalFilter = buildMongoSearchFilter(filter, advanced.search, ['name']);
  const instances = await Instance.paginate(finalFilter, finalOptions);
  instances.results = await new InterservicePopulateListDecorator(instances.results)
    .populate('created_by')
    .getPopulatedDocs();
  instances.results = new ParsedJsonPropertiesMongooseListDecorator(instances.results, 'data').getParsedPropertiesDataList();
  return instances;
};

/**
 * Get instance by id
 * @param {ObjectId} id
 * @returns {Promise<Instance>}
 */
const getInstanceById = async (id) => {
  const instance = await Instance.findById(id).populate('schema');
  if (!instance) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Instance not found');
  }

  if (!instance.schema) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Schema for instance not found');
  }

  return new InterservicePopulateListDecorator(
    new ParsedJsonPropertiesMongooseDecorator(instance, 'data').getParsedPropertiesData(),
  )
    .populate('created_by')
    .getSinglePopulatedDoc();
};

const isWriter = async (instanceId, userId) => {
  const instance = await getInstanceById(instanceId);
  const isAdmin = await authorizationClient.isAdmin(userId);
  return String(instance.created_by?.id) === String(userId) || isAdmin;
};

/**
 * Update instance by id
 * @param {ObjectId} instanceId
 * @param {Object} updateBody
 * @param {string} actionOwner
 * @returns {Promise<Instance>}
 */
const updateInstanceById = async (instanceId, updateBody, actionOwner) => {
  const instance = await getInstanceById(instanceId);

  // Re-validate data if it's being updated
  if (updateBody.data) {
    await validateDataAgainstSchema(instance.schema._id, updateBody.data);
  }

  updateBody.action_owner = actionOwner;
  Object.assign(instance, updateBody);
  instance.data = typeof instance.data === 'object' ? JSON.stringify(instance.data) : instance.data;
  await instance.save();
  return instance;
};

/**
 * Delete instance by id
 * @param {ObjectId} instanceId
 * @param {string} actionOwner
 * @returns {Promise<Instance>}
 */
const deleteInstanceById = async (instanceId, actionOwner) => {
  const instance = await getInstanceById(instanceId);
  instance.action_owner = actionOwner;
  await instance.remove();
  return instance;
};

module.exports.createInstance = createInstance;
module.exports.queryInstances = queryInstances;
module.exports.getInstanceById = getInstanceById;
module.exports.updateInstanceById = updateInstanceById;
module.exports.deleteInstanceById = deleteInstanceById;
module.exports.isWriter = isWriter;
