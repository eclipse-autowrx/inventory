// File: tests/unit/helpers/service-test.helper.js

const mongoose = require('mongoose');
const { Schema, Instance } = require('../../../src/models');
const { userService } = require('../../../src/services/interservice');
const { authorizationClient } = require('../../../src/config/authorizationClient');

/**
 * Common test IDs
 */
const testIds = {
  userId: new mongoose.Types.ObjectId(),
  adminUserId: new mongoose.Types.ObjectId(),
};

/**
 * Setup common mocks used across service tests
 * @returns {Object} The setup mocks
 */
const setupCommonMocks = () => {
  // Clear all mocks
  jest.clearAllMocks();

  // Setup admin authorization mock
  const adminMock = jest
    .spyOn(authorizationClient, 'isAdmin')
    .mockImplementation((id) => Promise.resolve(id === testIds.adminUserId.toString()));

  // Mock user service
  const userServiceMock = jest.spyOn(userService, 'getUsers').mockImplementation(function (options) {
    const ids = options.id.split(',');
    const result = ids.map((id) => ({
      id: id,
      name: 'Test user name',
      image_file: 'https://example.com/image.jpg',
    }));
    return Promise.resolve(result);
  });

  return {
    adminMock,
    userServiceMock,
  };
};

/**
 * Generate mock schema body for tests
 * @param {Object} overrides - Optional overrides for schema fields
 * @returns {Object} Mock schema body
 */
const generateMockSchemaBody = (overrides = {}) => ({
  name: 'Test Schema',
  description: 'Test schema description',
  schema_definition: JSON.stringify({
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'integer' },
    },
    required: ['name'],
  }),
  ...overrides,
});

/**
 * Create a test schema for use in tests
 * @param {Object} overrides - Optional overrides for schema fields
 * @param {mongoose.Types.ObjectId} userId - User ID to use as creator
 * @returns {Promise<Object>} The created schema
 */
const createTestSchema = async (overrides = {}, userId = testIds.userId) => {
  const defaultSchemaBody = generateMockSchemaBody();

  return await Schema.create({
    ...defaultSchemaBody,
    ...overrides,
    created_by: userId,
  });
};

/**
 * Generate mock instance body for tests
 * @param {mongoose.Types.ObjectId} schemaId - Schema ID to associate with instance
 * @param {Object} overrides - Optional overrides for instance fields
 * @returns {Object} Mock instance body
 */
const generateMockInstanceBody = (schemaId, overrides = {}) => ({
  name: 'Test Instance',
  schema: schemaId,
  data: JSON.stringify({
    name: 'Test Name',
    age: 30,
  }),
  ...overrides,
});

/**
 * Create a test instance for use in tests
 * @param {mongoose.Types.ObjectId} schemaId - Schema ID to associate with instance
 * @param {Object} overrides - Optional overrides for instance fields
 * @param {mongoose.Types.ObjectId} userId - User ID to use as creator
 * @returns {Promise<Object>} The created instance
 */
const createTestInstance = async (schemaId, overrides = {}, userId = testIds.userId) => {
  const instanceBody = generateMockInstanceBody(schemaId, overrides);

  return await Instance.create({
    ...instanceBody,
    created_by: userId,
  });
};

/**
 * Extract ID from arbitrary created_by field
 * @param {mongoose.Types.ObjectId | string | {id: string} | {_id: mongoose.Types.ObjectId}} createdBy
 * @returns {string|null} The extracted ID or null if not found
 */
const extractIdFromCreatedBy = (createdBy) => {
  if (createdBy instanceof mongoose.Types.ObjectId) {
    return createdBy.toString();
  } else if (typeof createdBy === 'string') {
    return createdBy;
  } else if (createdBy.id) {
    return createdBy.id;
  } else if (createdBy._id) {
    return createdBy._id.toString();
  }
  return null;
};

/**
 * Check if schema result matches expected schema
 * @param {Object} result - The result to check
 * @param {Object} schema - The expected schema
 */
const checkSchemaMatch = (result, schema) => {
  expect(result).toBeDefined();
  expect(result.name).toBe(schema.name);
  expect(result.description).toBe(schema.description);

  if (typeof schema.schema_definition === 'string') {
    expect(result.schema_definition).toEqual(JSON.parse(schema.schema_definition));
  } else {
    expect(result.schema_definition).toEqual(schema.schema_definition);
  }

  expect(result.created_by).toBeDefined();
  expect(result.created_by.id).toBe(extractIdFromCreatedBy(schema.created_by));
  expect(result.created_by.name).toBe('Test user name');
  expect(result.created_by.image_file).toBe('https://example.com/image.jpg');
};

/**
 * Check if instance result matches expected instance
 * @param {Object} result - The result to check
 * @param {Object} instance - The expected instance
 */
const checkInstanceMatch = (result, instance) => {
  expect(result).toBeDefined();
  expect(result.name).toBe(instance.name);
  expect(result.schema).toBeDefined();

  if (typeof instance.data === 'string') {
    expect(result.data).toEqual(JSON.parse(instance.data));
  } else {
    expect(result.data).toEqual(instance.data);
  }

  expect(result.created_by).toBeDefined();
  expect(result.created_by.id).toBe(extractIdFromCreatedBy(instance.created_by));
  expect(result.created_by.name).toBe('Test user name');
  expect(result.created_by.image_file).toBe('https://example.com/image.jpg');
};

/**
 * Check if results contain expected schemas
 * @param {Object} results - The results to check
 * @param {Array} schemas - The expected schemas
 */
const checkSchemasMatch = (results, schemas) => {
  expect(results).toBeDefined();
  expect(results.results.length).toBe(schemas.length);

  for (let i = 0; i < results.results.length; i++) {
    const resultSchema = results.results[i];
    const sourceSchema = schemas[i];

    expect(resultSchema.id).toBe(sourceSchema._id.toString());
    expect(resultSchema.name).toBe(sourceSchema.name);
    expect(resultSchema.description).toBe(sourceSchema.description);

    if (typeof sourceSchema.schema_definition === 'string') {
      expect(resultSchema.schema_definition).toEqual(JSON.parse(sourceSchema.schema_definition));
    } else {
      expect(resultSchema.schema_definition).toEqual(sourceSchema.schema_definition);
    }
    expect(resultSchema.created_by.id).toBe(extractIdFromCreatedBy(sourceSchema.created_by));
  }
};

/**
 * Check if results contain expected instances
 * @param {Object} results - The results to check
 * @param {Array} instances - The expected instances
 */
const checkInstancesMatch = (results, instances) => {
  expect(results).toBeDefined();
  expect(results.results.length).toBe(instances.length);

  for (let i = 0; i < results.results.length; i++) {
    const resultInstance = results.results[i];
    const sourceInstance = instances[i];

    expect(resultInstance.name).toBe(sourceInstance.name);
    expect(resultInstance.schema).toBeDefined();

    if (typeof sourceInstance.data === 'string') {
      expect(resultInstance.data).toEqual(JSON.parse(sourceInstance.data));
    } else {
      expect(resultInstance.data).toEqual(sourceInstance.data);
    }
  }
};

module.exports = {
  testIds,
  setupCommonMocks,
  createTestSchema,
  createTestInstance,
  generateMockSchemaBody,
  generateMockInstanceBody,
  checkSchemaMatch,
  checkInstanceMatch,
  checkSchemasMatch,
  checkInstancesMatch,
};
