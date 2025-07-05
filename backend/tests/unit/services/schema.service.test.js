// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const InterservicePopulateListDecorator = require('../../../src/decorators/InterservicePopulateDecorator');
const { schemaService } = require('../../../src/services');
const mongoose = require('mongoose');

describe('Schema Service', () => {
  let userId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.clearAllMocks();
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

  const insertMockSchema = async (overrides = {}) => {
    const mockSchemaBody = generateMockSchemaBody(overrides);
    const randomUserId = new mongoose.Types.ObjectId();
    return await schemaService.createSchema(mockSchemaBody, randomUserId.toString());
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
    it('should return paginated schemas', async () => {
      jest.spyOn(InterservicePopulateListDecorator.prototype, 'getPopulatedDocs').mockImplementation(function () {
        const mockedUsers = this.docs.map((doc) => ({
          _id: doc.created_by.toString(),
          name: 'Test user name',
          image_file: 'https://example.com/image.jpg',
        }));
        return Promise.resolve(mockedUsers);
      });

      const promises = [
        insertMockSchema({ name: 'Schema 1' }),
        insertMockSchema({ name: 'Schema 2' }),
        insertMockSchema({ name: 'Schema 3' }),
      ];
      const createdSchemas = await Promise.all(promises);

      const result = await schemaService.querySchemas({}, { limit: 2, page: 1 });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.totalPages).toBe(2);
      expect(result.totalCount).toBe(3);
      expect(result.results[0]).toHaveProperty('name', 'Schema 1');
    });
  });
});
