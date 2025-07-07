// File: tests/unit/helpers/service-test.helper.js

const mongoose = require('mongoose');
const { Schema, Instance, Relation, InstanceRelation } = require('../../../src/models');
const { userService } = require('../../../src/services/interservice');
const { authorizationClient } = require('../../../src/config/authorizationClient');

// ============================================================================
// COMMON TEST DATA
// ============================================================================

/**
 * Common test IDs
 */
const testIds = {
  userId: new mongoose.Types.ObjectId(),
  adminUserId: new mongoose.Types.ObjectId(),
};

// ============================================================================
// COMMON SETUP & MOCKS
// ============================================================================

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
 * Extract ID from arbitrary created_by field
 * @param {mongoose.Types.ObjectId | string | {id: string} | {_id: mongoose.Types.ObjectId}} objectOrPlain
 * @returns {string|null} The extracted ID or null if not found
 */
const extractIdFromObjectOrPlain = (objectOrPlain) => {
  if (objectOrPlain instanceof mongoose.Types.ObjectId) {
    return objectOrPlain.toString();
  } else if (typeof objectOrPlain === 'string') {
    return objectOrPlain;
  } else if (objectOrPlain.id) {
    return objectOrPlain.id;
  } else if (objectOrPlain._id) {
    return objectOrPlain._id.toString();
  }
  return null;
};

// ============================================================================
// SCHEMA HELPERS
// ============================================================================

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
  expect(result.created_by.id).toBe(extractIdFromObjectOrPlain(schema.created_by));
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
    checkSchemaMatch(results.results[i], schemas[i]);
  }
};

// ============================================================================
// INSTANCE HELPERS
// ============================================================================

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
  expect(result.created_by.id).toBe(extractIdFromObjectOrPlain(instance.created_by));
  expect(result.created_by.name).toBe('Test user name');
  expect(result.created_by.image_file).toBe('https://example.com/image.jpg');
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
    checkInstanceMatch(results.results[i], instances[i]);
  }
};

// ============================================================================
// RELATION HELPERS
// ============================================================================

/**
 * Generate mock relation body for tests
 * @param {mongoose.Types.ObjectId} sourceId - Source schema ID
 * @param {mongoose.Types.ObjectId} targetId - Target schema ID
 * @param {Object} overrides - Optional overrides for relation fields
 * @returns {Object} Mock relation body
 */
const generateMockRelationBody = (sourceId, targetId, overrides = {}) => {
  return {
    name: 'Test Relation',
    type: 'association',
    source: sourceId,
    target: targetId,
    source_role_name: 'has',
    target_role_name: 'belongsTo',
    source_cardinality: 'one-to-one',
    target_cardinality: 'one-to-many',
    description: 'Test relation description',
    ...overrides,
  };
};

/**
 * Create a test relation for use in tests
 * @param {mongoose.Types.ObjectId} sourceId - Source schema ID
 * @param {mongoose.Types.ObjectId} targetId - Target schema ID
 * @param {Object} overrides - Optional overrides for relation fields
 * @param {mongoose.Types.ObjectId} userId - User ID to use as creator
 * @returns {Promise<Object>} The created relation
 */
const createTestRelation = async (sourceId, targetId, overrides = {}, userId = testIds.userId) => {
  const relationBody = generateMockRelationBody(sourceId, targetId, overrides);

  const relation = await Relation.create({
    ...relationBody,
    created_by: userId,
  });
  return relation;
};

/**
 * Check if relation result matches expected relation
 * @param {Object} result - The result to check
 * @param {Object} relation - The expected relation
 */
const checkRelationMatch = (result, relation) => {
  expect(result).toBeDefined();
  expect(result.name).toBe(relation.name);
  expect(result.type).toBe(relation.type);

  // Handle both ObjectId and string comparison
  expect(result.source.id || result.source._id.toString()).toBe(relation.source.toString());
  expect(result.target.id || result.target._id.toString()).toBe(relation.target.toString());

  expect(result.description).toBe(relation.description);
  expect(result.source_cardinality).toBe(relation.source_cardinality);
  expect(result.target_cardinality).toBe(relation.target_cardinality);
  expect(result.source_role_name).toBe(relation.source_role_name);
  expect(result.target_role_name).toBe(relation.target_role_name);
  expect(extractIdFromObjectOrPlain(result.created_by)).toBe(extractIdFromObjectOrPlain(relation.created_by));
};

/**
 * Check if results contain expected relations
 * @param {Object} results - The results to check
 * @param {Array} relations - The expected relations
 */
const checkRelationsMatch = (results, relations) => {
  expect(results).toBeDefined();
  expect(results.results.length).toBe(relations.length);

  for (let i = 0; i < results.results.length; i++) {
    checkRelationMatch(results.results[i], relations[i]);
  }
};

/**
 * Generate mock instance relation body for tests
 * @param {mongoose.Types.ObjectId} relationId - Relation ID
 * @param {mongoose.Types.ObjectId} sourceId - Source instance ID
 * @param {mongoose.Types.ObjectId} targetId - Target instance ID
 * @param {Object} overrides - Optional overrides for instance relation fields
 * @returns {Object} Mock instance relation body
 */
const generateMockInstanceRelationBody = (relationId, sourceId, targetId, overrides = {}) => ({
  relation: relationId,
  source: sourceId,
  target: targetId,
  description: 'Test instance relation description',
  metadata: { status: 'active', priority: 'medium' },
  ...overrides,
});

// ============================================================================
// INSTANCE RELATION HELPERS
// ============================================================================

/**
 * Create a test instance relation for use in tests
 * @param {mongoose.Types.ObjectId} relationId - Relation ID
 * @param {mongoose.Types.ObjectId} sourceId - Source instance ID
 * @param {mongoose.Types.ObjectId} targetId - Target instance ID
 * @param {Object} overrides - Optional overrides for instance relation fields
 * @param {mongoose.Types.ObjectId} userId - User ID to use as creator
 * @returns {Promise<Object>} The created instance relation
 */
const createTestInstanceRelation = async (relationId, sourceId, targetId, overrides = {}, userId = testIds.userId) => {
  const instanceRelationBody = generateMockInstanceRelationBody(relationId, sourceId, targetId, overrides);

  return await InstanceRelation.create({
    ...instanceRelationBody,
    created_by: userId,
  });
};

/**
 * Check if instance relation result matches expected instance relation
 * @param {Object} result - The result to check
 * @param {Object} instanceRelation - The expected instance relation
 */
const checkInstanceRelationMatch = (result, instanceRelation) => {
  expect(result).toBeDefined();

  // Handle both ObjectId and string comparison
  expect(result.relation._id.toString()).toBe(instanceRelation.relation.toString());

  expect(result.source._id.toString()).toBe(instanceRelation.source.toString());

  expect(result.target._id.toString()).toBe(instanceRelation.target.toString());

  expect(result.description).toBe(instanceRelation.description);

  expect(result.metadata).toEqual(instanceRelation.metadata);

  expect(extractIdFromObjectOrPlain(result.created_by)).toBe(extractIdFromObjectOrPlain(instanceRelation.created_by));
};

/**
 * Check if results contain expected instance relations
 * @param {Object} results - The results to check
 * @param {Array} instanceRelations - The expected instance relations
 */
const checkInstanceRelationsMatch = (results, instanceRelations) => {
  expect(results).toBeDefined();
  expect(results.results.length).toBe(instanceRelations.length);

  for (let i = 0; i < results.results.length; i++) {
    checkInstanceRelationMatch(results.results[i], instanceRelations[i]);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

// Common test data
module.exports.testIds = testIds;

// Common setup & mocks
module.exports.setupCommonMocks = setupCommonMocks;
module.exports.extractIdFromObjectOrPlain = extractIdFromObjectOrPlain;

// Schema helpers
module.exports.generateMockSchemaBody = generateMockSchemaBody;
module.exports.createTestSchema = createTestSchema;
module.exports.checkSchemaMatch = checkSchemaMatch;
module.exports.checkSchemasMatch = checkSchemasMatch;

// Instance helpers
module.exports.generateMockInstanceBody = generateMockInstanceBody;
module.exports.createTestInstance = createTestInstance;
module.exports.checkInstanceMatch = checkInstanceMatch;
module.exports.checkInstancesMatch = checkInstancesMatch;

// Relation helpers
module.exports.generateMockRelationBody = generateMockRelationBody;
module.exports.createTestRelation = createTestRelation;
module.exports.checkRelationMatch = checkRelationMatch;
module.exports.checkRelationsMatch = checkRelationsMatch;

// Instance relation helpers
module.exports.generateMockInstanceRelationBody = generateMockInstanceRelationBody;
module.exports.createTestInstanceRelation = createTestInstanceRelation;
module.exports.checkInstanceRelationMatch = checkInstanceRelationMatch;
module.exports.checkInstanceRelationsMatch = checkInstanceRelationsMatch;
