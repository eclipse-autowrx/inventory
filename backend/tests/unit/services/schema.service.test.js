// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const { schemaService } = require('../../../src/services');
const mongoose = require('mongoose');
const SchemaModel = require('../../../src/models/schema.model');
const {
  testIds,
  setupCommonMocks,
  generateMockSchemaBody,
  createTestSchema,
  checkSchemaMatch,
  checkSchemasMatch,
} = require('../helpers/service-test.helper');

describe('Schema Service', () => {
  let userId;
  let adminUserId;

  beforeEach(() => {
    userId = testIds.userId;
    adminUserId = testIds.adminUserId;
    setupCommonMocks();
  });

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
      createdSchemas.push(await createTestSchema({ name: 'Schema 1', description: 'Description 1' }));
      createdSchemas.push(await createTestSchema({ name: 'Schema 2', description: 'Matching text 1' }));
      createdSchemas.push(await createTestSchema({ name: 'Matching text 2', description: 'Description 2' }));
    });

    it('should return paginated schemas', async () => {
      const result = await schemaService.querySchemas({}, { limit: 2, page: 1 });
      expect(result).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.totalResults).toBe(3);
      checkSchemasMatch(result, createdSchemas.slice(0, 2));
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
      checkSchemaMatch(result.results[0], createdSchemas[0]);
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
      checkSchemaMatch(result.results[0], createdSchemas[0]);
    });

    it('should return schemas with matching search term', async () => {
      const result = await schemaService.querySchemas({}, { limit: 2, page: 1 }, { search: 'Matching text' });
      expect(result).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.totalPages).toBe(1);
      expect(result.totalResults).toBe(2);
      checkSchemaMatch(result.results[0], createdSchemas[1]);
      checkSchemaMatch(result.results[1], createdSchemas[2]);
    });
  });

  describe('getSchemaById', () => {
    it('should return schema by id', async () => {
      const createdSchema = await createTestSchema();
      const result = await schemaService.getSchemaById(createdSchema._id.toString());
      expect(result).toBeDefined();
      checkSchemaMatch(result, createdSchema);
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
      testSchema = await createTestSchema(
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
      testSchema = await createTestSchema(
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

  describe('isWriter', () => {
    let testSchema;

    beforeEach(async () => {
      testSchema = await createTestSchema(
        {
          name: 'Test Schema for Permissions',
          schema_definition: JSON.stringify({
            type: 'object',
            properties: { name: { type: 'string' } },
          }),
        },
        userId.toString(),
      );
    });

    it('should return true for schema creator', async () => {
      const result = await schemaService.isWriter(testSchema.id, userId.toString());
      expect(result).toBe(true);
    });

    it('should return true for admin user', async () => {
      const result = await schemaService.isWriter(testSchema.id, adminUserId.toString());
      expect(result).toBe(true);
    });

    it('should return false for other users', async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      const result = await schemaService.isWriter(testSchema.id, otherUserId.toString());
      expect(result).toBe(false);
    });

    it('should throw error for non-existent schema', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(schemaService.isWriter(nonExistentId, userId.toString())).rejects.toThrow('Schema not found');
    });
  });
});
