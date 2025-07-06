// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const mongoose = require('mongoose');
const { instanceService, schemaService } = require('../../../src/services');
const { Instance } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const {
  testIds,
  setupCommonMocks,
  generateMockInstanceBody,
  createTestInstance,
  createTestSchema,
  checkInstanceMatch,
  checkInstancesMatch,
} = require('../helpers/service-test.helper');

describe('Instance Service', () => {
  let userId;
  let adminUserId;
  let mockSchema;

  beforeEach(async () => {
    userId = testIds.userId;
    adminUserId = testIds.adminUserId;
    setupCommonMocks();

    // Create a test schema for instances to use
    mockSchema = await createTestSchema();
  });

  describe('createInstance', () => {
    it('should create instance successfully', async () => {
      const instanceBody = generateMockInstanceBody(mockSchema._id);
      const result = await instanceService.createInstance(instanceBody, userId.toString());

      expect(result).toBeDefined();
      expect(result.name).toBe(instanceBody.name);
      expect(result.schema.toString()).toBe(instanceBody.schema.toString());
      expect(result.data).toBe(instanceBody.data);
      expect(result.created_by.toString()).toBe(userId.toString());
    });

    it('should throw an error if missing name', async () => {
      const invalidInstanceBody = generateMockInstanceBody(mockSchema._id, { name: '' });
      await expect(instanceService.createInstance(invalidInstanceBody, userId.toString())).rejects.toThrow(
        /Instance validation failed: name: Path `name` is required./,
      );
    });

    it('should throw error when schema validation fails', async () => {
      const invalidInstanceBody = generateMockInstanceBody(mockSchema._id, {
        data: JSON.stringify({
          // Missing required 'name'
          age: 30,
        }),
      });

      await expect(instanceService.createInstance(invalidInstanceBody, userId.toString())).rejects.toThrow(
        /Data validation error/,
      );
    });

    it('should throw error when schema does not exist', async () => {
      const nonExistentSchemaId = new mongoose.Types.ObjectId();
      const invalidInstanceBody = generateMockInstanceBody(nonExistentSchemaId);

      await expect(instanceService.createInstance(invalidInstanceBody, userId.toString())).rejects.toThrow(
        /Schema with id .* not found for validation/,
      );
    });

    it('should store created_by as ObjectId', async () => {
      const result = await createTestInstance(mockSchema._id, {}, userId.toString());

      expect(result.created_by).toBeInstanceOf(mongoose.Types.ObjectId);
      expect(result.created_by.toString()).toBe(userId.toString());
    });
  });

  describe('queryInstances', () => {
    let createdInstances;

    beforeEach(async () => {
      createdInstances = [];
      createdInstances.push(await createTestInstance(mockSchema._id, { name: 'Instance 1' }));
      createdInstances.push(await createTestInstance(mockSchema._id, { name: 'Instance 2' }));
      createdInstances.push(
        await createTestInstance(mockSchema._id, {
          name: 'Special Instance',
          data: JSON.stringify({
            name: 'Special Tital',
            age: 50,
          }),
        }),
      );
    });

    it('should return paginated instances', async () => {
      const result = await instanceService.queryInstances({}, { limit: 2, page: 1 });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.totalResults).toBe(3);
      expect(result.limit).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
      checkInstancesMatch(result, createdInstances.slice(0, 2));
    });

    it('should filter instances by schema', async () => {
      const anotherSchema = await createTestSchema();
      await createTestInstance(anotherSchema._id, {
        name: 'Another Schema Instance',
      });

      const result = await instanceService.queryInstances({ schema: mockSchema._id.toString() }, { limit: 10 });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(3);
      expect(
        result.results.every(
          (inst) =>
            inst.schema.id.toString() === mockSchema._id.toString() ||
            inst.schema._id.toString() === mockSchema._id.toString(),
        ),
      ).toBe(true);
    });

    it('should sort instances by specified field', async () => {
      const result = await instanceService.queryInstances({}, { sortBy: 'name:desc' });

      expect(result).toBeDefined();
      expect(result.results[0].name).toBe('Special Instance');
      expect(result.results[result.results.length - 1].name).toBe('Instance 1');
    });

    it('should search instances by term in name', async () => {
      const result = await instanceService.queryInstances({}, {}, { search: 'special' });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(1);
      expect(result.results[0].name).toBe('Special Instance');
    });

    it('should return empty results when no instances match filter', async () => {
      const result = await instanceService.queryInstances({ name: 'Non-existent Instance' });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(0);
      expect(result.totalResults).toBe(0);
    });
  });

  describe('getInstanceById', () => {
    let testInstance;

    beforeEach(async () => {
      testInstance = await createTestInstance(mockSchema._id);
    });

    it('should return instance with valid id', async () => {
      // Mock schemaService.getSchemaById which is used in getInstanceById
      jest.spyOn(schemaService, 'getSchemaById').mockResolvedValueOnce({
        _id: mockSchema._id,
        name: mockSchema.name,
        schema_definition: mockSchema.schema_definition,
      });

      const result = await instanceService.getInstanceById(testInstance._id);

      expect(result).toBeDefined();
      expect(result.id).toBe(testInstance._id.toString());
      expect(result.name).toBe(testInstance.name);
      expect(result.schema).toBeDefined();
    });

    it('should throw NOT_FOUND error for non-existent instance', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(instanceService.getInstanceById(nonExistentId)).rejects.toThrow('Instance not found');
    });

    it('should throw error if schema no longer exists', async () => {
      // Mock schema not found
      jest.spyOn(schemaService, 'getSchemaById').mockRejectedValueOnce(new ApiError(404, 'Schema not found'));

      await expect(instanceService.getInstanceById(testInstance._id)).rejects.toThrow('Schema for instance not found');
    });

    it('should populate schema and creator details', async () => {
      // Mock schema service
      jest.spyOn(schemaService, 'getSchemaById').mockResolvedValueOnce({
        _id: mockSchema._id,
        name: 'Test Schema',
        description: 'Schema for testing',
        schema_definition: mockSchema.schema_definition,
      });

      const result = await instanceService.getInstanceById(testInstance._id);

      expect(result.schema).toEqual(
        expect.objectContaining({
          _id: mockSchema._id,
          name: 'Test Schema',
        }),
      );

      expect(result.created_by).toEqual(
        expect.objectContaining({
          id: userId.toString(),
          name: expect.any(String),
          image_file: expect.any(String),
        }),
      );
    });
  });

  describe('isWriter', () => {
    let testInstance;

    beforeEach(async () => {
      testInstance = await createTestInstance(mockSchema._id);
    });

    it('should return true for instance creator', async () => {
      // Mock getInstanceById to avoid full implementation
      jest.spyOn(instanceService, 'getInstanceById').mockResolvedValueOnce({
        created_by: { id: userId.toString() },
      });

      const result = await instanceService.isWriter(testInstance._id, userId.toString());
      expect(result).toBe(true);
    });

    it('should return true for admin user', async () => {
      jest.spyOn(instanceService, 'getInstanceById').mockResolvedValueOnce({
        created_by: { id: userId.toString() },
      });

      const result = await instanceService.isWriter(testInstance._id, adminUserId.toString());
      expect(result).toBe(true);
    });

    it('should return false for other users', async () => {
      const otherUserId = new mongoose.Types.ObjectId();

      jest.spyOn(instanceService, 'getInstanceById').mockResolvedValueOnce({
        created_by: { id: userId.toString() },
      });

      const result = await instanceService.isWriter(testInstance._id, otherUserId.toString());
      expect(result).toBe(false);
    });
  });

  describe('updateInstanceById', () => {
    let testInstance;

    beforeEach(async () => {
      testInstance = await createTestInstance(mockSchema._id);

      // Setup mock for getInstanceById
      jest.spyOn(instanceService, 'getInstanceById').mockResolvedValue({
        ...testInstance,
        schema: {
          _id: mockSchema._id,
          schema_definition: mockSchema.schema_definition,
        },
        save: jest.fn().mockResolvedValue(testInstance),
      });
    });

    it('should update name successfully', async () => {
      const updateBody = {
        name: 'Updated Instance Name',
      };

      const result = await instanceService.updateInstanceById(testInstance._id, updateBody, userId.toString());

      expect(result.name).toBe(updateBody.name);
    });

    it('should update data and validate against schema', async () => {
      const updateBody = {
        data: JSON.stringify({
          title: 'Updated Title',
          type: 'object',
          properties: {
            updated: { type: 'string' },
          },
        }),
      };

      // Mock validateDataAgainstSchema to verify it's called
      const validateSpy = jest.spyOn(instanceService, 'validateDataAgainstSchema').mockResolvedValueOnce(true);

      await instanceService.updateInstanceById(testInstance._id, updateBody, userId.toString());

      expect(validateSpy).toHaveBeenCalledWith(mockSchema._id, updateBody.data);
    });

    it('should throw error when updating with invalid data', async () => {
      const updateBody = {
        data: JSON.stringify({
          // Missing required title
          type: 'object',
        }),
      };

      // Mock validation to fail
      jest
        .spyOn(instanceService, 'validateDataAgainstSchema')
        .mockRejectedValueOnce(new ApiError(400, 'Data validation error: required property missing'));

      await expect(instanceService.updateInstanceById(testInstance._id, updateBody, userId.toString())).rejects.toThrow(
        'Data validation error',
      );
    });

    it('should track action_owner', async () => {
      const updateBody = { name: 'New Name' };

      await instanceService.updateInstanceById(testInstance._id, updateBody, userId.toString());

      expect(testInstance.action_owner).toBe(userId.toString());
    });

    it('should throw error for non-existent instance', async () => {
      jest.spyOn(instanceService, 'getInstanceById').mockRejectedValueOnce(new ApiError(404, 'Instance not found'));

      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(
        instanceService.updateInstanceById(nonExistentId, { name: 'New Name' }, userId.toString()),
      ).rejects.toThrow('Instance not found');
    });
  });

  describe('deleteInstanceById', () => {
    let testInstance;

    beforeEach(async () => {
      testInstance = await createTestInstance(mockSchema._id);
    });

    it('should delete instance successfully', async () => {
      // Mock instance removal
      const removeMock = jest.fn().mockResolvedValueOnce(testInstance);

      jest.spyOn(instanceService, 'getInstanceById').mockResolvedValueOnce({
        ...testInstance,
        remove: removeMock,
      });

      await instanceService.deleteInstanceById(testInstance._id, userId.toString());

      expect(removeMock).toHaveBeenCalled();
    });

    it('should set action_owner before deletion', async () => {
      // Mock instance for checking action_owner is set
      const instanceMock = {
        ...testInstance,
        remove: jest.fn().mockResolvedValueOnce(testInstance),
      };

      jest.spyOn(instanceService, 'getInstanceById').mockResolvedValueOnce(instanceMock);

      await instanceService.deleteInstanceById(testInstance._id, userId.toString());

      expect(instanceMock.action_owner).toBe(userId.toString());
      expect(instanceMock.remove).toHaveBeenCalled();
    });

    it('should throw error for non-existent instance', async () => {
      jest.spyOn(instanceService, 'getInstanceById').mockRejectedValueOnce(new ApiError(404, 'Instance not found'));

      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(instanceService.deleteInstanceById(nonExistentId, userId.toString())).rejects.toThrow(
        'Instance not found',
      );
    });
  });

  describe('Integration tests', () => {
    it('should perform full CRUD lifecycle', async () => {
      // Create
      const instanceBody = generateMockInstanceBody(mockSchema._id);
      const instance = await instanceService.createInstance(instanceBody, userId.toString());

      expect(instance.id).toBeDefined();

      // Read
      const retrieved = await Instance.findById(instance._id);
      expect(retrieved.name).toBe(instance.name);

      // Update
      retrieved.name = 'Updated Name';
      await retrieved.save();
      const updated = await Instance.findById(instance._id);
      expect(updated.name).toBe('Updated Name');

      // Delete
      await updated.remove();
      const deleted = await Instance.findById(instance._id);
      expect(deleted).toBeNull();
    });

    it('should handle complex data structures', async () => {
      const complexData = {
        title: 'Complex Instance',
        type: 'object',
        properties: {
          nested: {
            type: 'object',
            properties: {
              array: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    value: { type: 'number' },
                    label: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      };

      const instance = await createTestInstance(mockSchema._id, {
        data: JSON.stringify(complexData),
      });

      expect(instance).toBeDefined();
      expect(JSON.parse(instance.data)).toEqual(complexData);
    });
  });
});
