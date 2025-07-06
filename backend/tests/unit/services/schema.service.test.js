// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const { default: axios } = require('axios');
const { schemaService } = require('../../../src/services');
const mongoose = require('mongoose');
const { userService } = require('../../../src/services/interservice');
const { Schema } = require('../../../src/models');
const SchemaModel = require('../../../src/models/schema.model');

describe('Schema Service', () => {
  let userId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Mock interservice user data
  jest.spyOn(userService, 'getUsers').mockImplementation(function (options) {
    const ids = options.id.split(',');
    const result = ids.map((id) => ({
      id: id,
      name: 'Test user name',
      image_file: 'https://example.com/image.jpg',
    }));
    return Promise.resolve(result);
  });

  const generateMockSchemaBody = (overrides = {}) => ({
    name: 'Test Schema',
    description: 'Test Schema description',
    schema_definition: JSON.stringify({
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        type: { type: 'string', enum: ['object', 'array'] },
        properties: {
          type: 'object',
          additionalProperties: true,
        },
      },
      required: ['title', 'type'],
    }),
    ...overrides,
  });

  const insertMockSchema = async (overrides = {}, userId = undefined) => {
    const mockSchemaBody = generateMockSchemaBody(overrides);
    const randomUserId = new mongoose.Types.ObjectId();
    return await schemaService.createSchema(mockSchemaBody, randomUserId.toString());
  };

  const checkMatchFullResults = (result, createdSchemas, overrides = {}) => {
    expect(result).toBeDefined();
    expect(result.results.length).toBe(overrides?.resultsLength || 2);
    expect(result.totalPages).toBe(overrides?.totalPages || 2);
    expect(result.totalResults).toBe(overrides?.totalResults || createdSchemas.length);
    expect(result.results).toEqual(
      expect.arrayContaining(
        createdSchemas.slice(0, 2).map((schema) =>
          expect.objectContaining({
            name: schema.name,
            description: schema.description,
            schema_definition: JSON.parse(schema.schema_definition),
            created_by: expect.objectContaining({
              id: schema.created_by.toString(),
              name: 'Test user name',
              image_file: 'https://example.com/image.jpg',
            }),
          }),
        ),
      ),
    );
  };

  const checkMatchSingleResult = (result, createdSchema) => {
    expect(result).toBeDefined();
    expect(result.name).toBe(createdSchema.name);
    expect(result.description).toBe(createdSchema.description);
    expect(result.schema_definition).toEqual(JSON.parse(createdSchema.schema_definition));
    expect(result.created_by.id).toBe(createdSchema.created_by.toString());
    expect(result.created_by.name).toBe('Test user name');
    expect(result.created_by.image_file).toBe('https://example.com/image.jpg');
  };

  describe('createSchema', () => {
    const mockSchemaBody = generateMockSchemaBody();

    it('should create a schema successfully', async () => {
      const result = await schemaService.createSchema(mockSchemaBody, userId.toString());
      expect(result).toBeDefined();
      expect(result.name).toBe(mockSchemaBody.name);
      expect(result.description).toBe(mockSchemaBody.description);
      expect(result.schema_definition).toBe(mockSchemaBody.schema_definition);
      expect(result.created_by).toEqual(userId);
    });

    it('should throw an error if schema definition is invalid', async () => {
      const invalidSchemaBody = { ...mockSchemaBody, schema_definition: '{ invalid json }' };
      await expect(schemaService.createSchema(invalidSchemaBody, userId.toString())).rejects.toThrow(
        'Schema validation error: Invalid JSON format',
      );
    });

    it('should throw an error if description is too long', async () => {
      const tooLongDescription = 'a'.repeat('4001');
      const invalidSchemaBody = { ...mockSchemaBody, description: tooLongDescription };
      await expect(schemaService.createSchema(invalidSchemaBody, userId.toString())).rejects.toThrow();
    });

    it('should throw an error if schema definition is not a valid JSON schema', async () => {
      const invalidSchemaBody = {
        ...mockSchemaBody,
        schema_definition: JSON.stringify({
          test: 'non exist data',
        }),
      };
      await expect(schemaService.createSchema(invalidSchemaBody, userId.toString())).rejects.toThrow(
        `Schema validation error: strict mode: unknown keyword: "test"`,
      );
    });

    it('should throw an error if schema name is empty', async () => {
      const invalidSchemaBody = { ...mockSchemaBody, name: '' };
      await expect(schemaService.createSchema(invalidSchemaBody, userId.toString())).rejects.toThrow(
        'Schema validation failed: name: Path `name` is required.',
      );
    });
  });

  describe('querySchemas', () => {
    let createdSchemas;

    beforeEach(async () => {
      createdSchemas = [];
      createdSchemas.push(await insertMockSchema({ name: 'Schema 1', description: 'Description 1' }));
      createdSchemas.push(await insertMockSchema({ name: 'Schema 2', description: 'Matching text 1' }));
      createdSchemas.push(await insertMockSchema({ name: 'Matching text 2', description: 'Description 2' }));
    });

    it('should return paginated schemas', async () => {
      const result = await schemaService.querySchemas({}, { limit: 2, page: 1 });
      checkMatchFullResults(result, createdSchemas);
    });

    it('should return empty results when no schemas match the filter', async () => {
      const result = await schemaService.querySchemas({ name: 'Not exist schema' }, { limit: 2, page: 1 });
      expect(result).toBeDefined();
      expect(result.results.length).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.totalResults).toBe(0);
    });

    it('should return matching name schemas', async () => {
      const result = await schemaService.querySchemas({ name: 'Schema 1' }, { limit: 2, page: 1 });
      expect(result).toBeDefined();
      expect(result.results.length).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.totalResults).toBe(1);
      checkMatchSingleResult(result.results[0], createdSchemas[0]);
    });

    it('should filter schemas by created_by', async () => {
      const result = await schemaService.querySchemas(
        {
          created_by: createdSchemas[0].created_by.toString(),
        },
        { limit: 2 },
      );
      expect(result).toBeDefined();
      expect(result.results.length).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.totalResults).toBe(1);
      checkMatchSingleResult(result.results[0], createdSchemas[0]);
    });

    it('should return schemas with matching search term', async () => {
      const result = await schemaService.querySchemas({}, { limit: 2, page: 1 }, { search: 'Matching text' });
      expect(result).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(result.totalResults).toBe(2);
      checkMatchSingleResult(result.results[0], createdSchemas[1]);
      checkMatchSingleResult(result.results[1], createdSchemas[2]);
    });
  });

  describe('getSchemaById', () => {
    it('should return schema by id', async () => {
      const createdSchema = await insertMockSchema();
      const result = await schemaService.getSchemaById(createdSchema._id.toString());
      expect(result).toBeDefined();
      checkMatchSingleResult(result, createdSchema);
    });

    it('should throw 404 error if schema not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      await expect(schemaService.getSchemaById(nonExistentId)).rejects.toThrow('Schema not found');
    });

    it('should throw error for invalid ObjectId format', async () => {
      await expect(schemaService.getSchemaById('invalid-id')).rejects.toThrow();
    });
  });

  describe('updateSchemaById', () => {
    let testSchema;

    beforeEach(async () => {
      testSchema = await insertMockSchema(
        {
          name: 'Original Schema Name',
          description: 'Original description',
          schema_definition: JSON.stringify({
            type: 'object',
            properties: { name: { type: 'string' } },
          }),
        },
        userId.toString(),
      );
    });

    it('should update name and description', async () => {
      const updateBody = {
        name: 'Updated Schema Name',
        description: 'Updated description',
      };

      const result = await schemaService.updateSchemaById(testSchema.id, updateBody, userId.toString());

      expect(result.name).toBe(updateBody.name);
      expect(result.description).toBe(updateBody.description);
      expect(result.schema_definition).toBe(testSchema.schema_definition);
    });

    it('should update schema_definition', async () => {
      const updateBody = {
        schema_definition: JSON.stringify({
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
        }),
      };

      const result = await schemaService.updateSchemaById(testSchema.id, updateBody, userId.toString());

      expect(result.schema_definition).toBe(updateBody.schema_definition);
    });

    it('should throw error with invalid schema_definition', async () => {
      const updateBody = {
        schema_definition: JSON.stringify({
          type: 'invalid-type',
          properties: { name: { type: 'string' } },
        }),
      };

      await expect(schemaService.updateSchemaById(testSchema.id, updateBody, userId.toString())).rejects.toThrow(
        /Schema validation error/,
      );
    });

    it('should throw error for non-existent schema', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(schemaService.updateSchemaById(nonExistentId, { name: 'New Name' }, userId.toString())).rejects.toThrow(
        'Schema not found',
      );
    });
  });

  describe('deleteSchemaById', () => {
    let testSchema;

    beforeEach(async () => {
      testSchema = await insertMockSchema(
        {
          name: 'Schema To Delete',
          schema_definition: JSON.stringify({
            type: 'object',
            properties: { name: { type: 'string' } },
          }),
        },
        userId.toString(),
      );
    });

    it('should delete schema successfully', async () => {
      await schemaService.deleteSchemaById(testSchema.id, userId.toString());

      await expect(schemaService.getSchemaById(testSchema.id)).rejects.toThrow('Schema not found');
    });

    it('should set action_owner before deletion', async () => {
      const schemaSpy = jest.spyOn(SchemaModel.prototype, 'remove');

      await schemaService.deleteSchemaById(testSchema.id, userId.toString());

      expect(schemaSpy).toHaveBeenCalled();
      const calledSchema = schemaSpy.mock.instances[0];
      expect(calledSchema.action_owner).toBe(userId.toString());
    });

    it('should throw error for non-existent schema', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(schemaService.deleteSchemaById(nonExistentId, userId.toString())).rejects.toThrow('Schema not found');
    });
  });
});
