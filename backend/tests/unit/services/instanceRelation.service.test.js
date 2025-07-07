// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const mongoose = require('mongoose');
const { instanceRelationService, relationService } = require('../../../src/services');
const { InstanceRelation, Relation } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const {
  testIds,
  setupCommonMocks,
  createTestSchema,
  createTestInstance,
  createTestRelation,
  createTestInstanceRelation,
  generateMockInstanceRelationBody,
  checkInstanceRelationMatch,
  checkInstanceRelationsMatch,
} = require('../helpers/service-test.helper');

describe('Instance Relation Service', () => {
  let userId;
  let adminUserId;
  let mockSchema;
  let targetSchema;
  let mockRelation;
  let sourceInstance;
  let targetInstance;

  beforeEach(async () => {
    userId = testIds.userId;
    adminUserId = testIds.adminUserId;
    setupCommonMocks();

    // Create test schemas, relation, and instances for testing
    mockSchema = await createTestSchema({ name: 'Source Schema' });
    targetSchema = await createTestSchema({ name: 'Target Schema' });
    mockRelation = await createTestRelation(mockSchema._id, targetSchema._id);
    sourceInstance = await createTestInstance(mockSchema._id);
    targetInstance = await createTestInstance(targetSchema._id);
  });

  describe('createInstanceRelation', () => {
    it('should create instance relation successfully', async () => {
      const instanceRelationBody = generateMockInstanceRelationBody(
        mockRelation._id,
        sourceInstance._id,
        targetInstance._id,
      );
      const result = await instanceRelationService.createInstanceRelation(instanceRelationBody, userId.toString());

      expect(result).toBeDefined();
      expect(result.relation.toString()).toBe(instanceRelationBody.relation.toString());
      expect(result.source.toString()).toBe(instanceRelationBody.source.toString());
      expect(result.target.toString()).toBe(instanceRelationBody.target.toString());
      expect(result.created_by.toString()).toBe(userId.toString());
    });

    it('should throw error if relation does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const instanceRelationBody = generateMockInstanceRelationBody(nonExistentId, sourceInstance._id, targetInstance._id);

      await expect(instanceRelationService.createInstanceRelation(instanceRelationBody, userId.toString())).rejects.toThrow(
        `Relation with id ${nonExistentId} not found.`,
      );
    });

    it('should throw error if source instance does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const instanceRelationBody = generateMockInstanceRelationBody(mockRelation._id, nonExistentId, targetInstance._id);

      await expect(instanceRelationService.createInstanceRelation(instanceRelationBody, userId.toString())).rejects.toThrow(
        `Source instance with id ${nonExistentId} not found.`,
      );
    });

    it('should throw error if target instance does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const instanceRelationBody = generateMockInstanceRelationBody(mockRelation._id, sourceInstance._id, nonExistentId);

      await expect(instanceRelationService.createInstanceRelation(instanceRelationBody, userId.toString())).rejects.toThrow(
        `Target instance with id ${nonExistentId} not found.`,
      );
    });

    it('should throw error if source instance schema does not match relation source schema', async () => {
      // Create instance with different schema
      const anotherSchema = await createTestSchema({ name: 'Another Schema' });
      const invalidSourceInstance = await createTestInstance(anotherSchema._id);

      const instanceRelationBody = generateMockInstanceRelationBody(
        mockRelation._id,
        invalidSourceInstance._id,
        targetInstance._id,
      );

      await expect(instanceRelationService.createInstanceRelation(instanceRelationBody, userId.toString())).rejects.toThrow(
        /Source instance's schema .* does not match relation's defined source schema/,
      );
    });

    it('should throw error if target instance schema does not match relation target schema', async () => {
      // Create instance with different schema
      const anotherSchema = await createTestSchema({ name: 'Another Schema' });
      const invalidTargetInstance = await createTestInstance(anotherSchema._id);

      const instanceRelationBody = generateMockInstanceRelationBody(
        mockRelation._id,
        sourceInstance._id,
        invalidTargetInstance._id,
      );

      await expect(instanceRelationService.createInstanceRelation(instanceRelationBody, userId.toString())).rejects.toThrow(
        /Target instance's schema .* does not match relation's defined target schema/,
      );
    });

    it('should throw error if relation between instances already exists', async () => {
      const instanceRelationBody = generateMockInstanceRelationBody(
        mockRelation._id,
        sourceInstance._id,
        targetInstance._id,
      );

      // Create first instance relation
      await instanceRelationService.createInstanceRelation(instanceRelationBody, userId.toString());

      // Try to create same instance relation again
      await expect(instanceRelationService.createInstanceRelation(instanceRelationBody, userId.toString())).rejects.toThrow(
        'This exact relation between these instances already exists.',
      );
    });

    it('should throw error when violating source cardinality constraint', async () => {
      // Create relation with one-to-one source cardinality
      const oneToOneRelation = await createTestRelation(mockSchema._id, targetSchema._id, {
        name: 'One-to-One Source Relation',
        source_cardinality: 'one-to-one',
        type: 'sourceCardinality',
      });

      // Create source instances
      const sourceInstance1 = await createTestInstance(mockSchema._id, { name: 'Source 1' });
      const sourceInstance2 = await createTestInstance(mockSchema._id, { name: 'Source 2' });

      // First relation is OK
      const firstRelationBody = generateMockInstanceRelationBody(
        oneToOneRelation._id,
        sourceInstance1._id,
        targetInstance._id,
      );
      await instanceRelationService.createInstanceRelation(firstRelationBody, userId.toString());

      // Second relation violates one-to-one source cardinality constraint
      const secondRelationBody = generateMockInstanceRelationBody(
        oneToOneRelation._id,
        sourceInstance2._id,
        targetInstance._id,
      );

      await expect(
        instanceRelationService.createInstanceRelation(secondRelationBody, userId.toString(), true),
      ).rejects.toThrow(/Cannot create this instance relation: violates source cardinality/);
    });

    it('should throw error when violating target cardinality constraint', async () => {
      // Create relation with one-to-one target cardinality
      const oneToOneRelation = await createTestRelation(mockSchema._id, targetSchema._id, {
        name: 'One-to-One Target Relation',
        target_cardinality: 'one-to-one',
        type: 'targetCardinality',
      });

      // Create target instances
      const targetInstance1 = await createTestInstance(targetSchema._id, { name: 'Target 1' });
      const targetInstance2 = await createTestInstance(targetSchema._id, { name: 'Target 2' });

      // First relation is OK
      const firstRelationBody = generateMockInstanceRelationBody(
        oneToOneRelation._id,
        sourceInstance._id,
        targetInstance1._id,
      );
      await instanceRelationService.createInstanceRelation(firstRelationBody, userId.toString());

      // Second relation violates one-to-one target cardinality constraint
      const secondRelationBody = generateMockInstanceRelationBody(
        oneToOneRelation._id,
        sourceInstance._id,
        targetInstance2._id,
      );

      await expect(instanceRelationService.createInstanceRelation(secondRelationBody, userId.toString())).rejects.toThrow(
        /Cannot create this instance relation: violates target cardinality/,
      );
    });
  });

  describe('queryInstanceRelations', () => {
    let createdInstanceRelations;

    beforeEach(async () => {
      createdInstanceRelations = [];

      // Create multiple relations for different test scenarios
      const relationOneToMany = await createTestRelation(mockSchema._id, targetSchema._id, {
        name: 'One to Many Relation',
        type: 'composition_relation1',
      });

      const relationManyToMany = await createTestRelation(mockSchema._id, targetSchema._id, {
        name: 'Many to Many Relation',
        type: 'association_relation2',
      });

      // Create multiple instances
      const sourceInstance1 = await createTestInstance(mockSchema._id, { name: 'Source 1' });
      const sourceInstance2 = await createTestInstance(mockSchema._id, { name: 'Source 2' });
      const targetInstance1 = await createTestInstance(targetSchema._id, { name: 'Target 1' });
      const targetInstance2 = await createTestInstance(targetSchema._id, { name: 'Target 2' });

      // Create instance relations
      createdInstanceRelations.push(
        await createTestInstanceRelation(relationOneToMany._id, sourceInstance1._id, targetInstance1._id, {
          description: 'First instance relation',
        }),
      );

      createdInstanceRelations.push(
        await createTestInstanceRelation(relationOneToMany._id, sourceInstance1._id, targetInstance2._id, {
          description: 'Second instance relation',
        }),
      );

      createdInstanceRelations.push(
        await createTestInstanceRelation(relationManyToMany._id, sourceInstance2._id, targetInstance1._id, {
          description: 'Third instance relation with special metadata',
          metadata: { priority: 'high' },
        }),
      );
    });

    it('should return paginated instance relations', async () => {
      const result = await instanceRelationService.queryInstanceRelations({}, { limit: 2, page: 1 });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.totalResults).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
      checkInstanceRelationsMatch(result, createdInstanceRelations.slice(0, 2));
    });

    it('should filter instance relations by relation ID', async () => {
      const relationId = createdInstanceRelations[0].relation;
      const result = await instanceRelationService.queryInstanceRelations({ relation: relationId });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(2); // Two relations with the same relation ID
      expect(result.totalResults).toBe(2);
      checkInstanceRelationMatch(result.results[0], createdInstanceRelations[0]);
      checkInstanceRelationMatch(result.results[1], createdInstanceRelations[1]);
    });

    it('should filter instance relations by source instance ID', async () => {
      const sourceId = createdInstanceRelations[0].source;
      const result = await instanceRelationService.queryInstanceRelations({ source: sourceId });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(2); // Two relations with the same source
      expect(result.totalResults).toBe(2);
      checkInstanceRelationMatch(result.results[0], createdInstanceRelations[0]);
      checkInstanceRelationMatch(result.results[1], createdInstanceRelations[1]);
    });

    it('should filter instance relations by target instance ID', async () => {
      const targetId = createdInstanceRelations[0].target;
      const result = await instanceRelationService.queryInstanceRelations({ target: targetId });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(2); // Two relations with the same target
      expect(result.results[0].source.toString()).not.toBe(result.results[1].source.toString());
    });

    it('should combine multiple filters', async () => {
      const relationId = createdInstanceRelations[0].relation;
      const sourceId = createdInstanceRelations[0].source;

      const result = await instanceRelationService.queryInstanceRelations({
        relation: relationId,
        source: sourceId,
      });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.results[0].relation._id.toString()).toBe(relationId.toString());
      expect(result.results[0].source._id.toString()).toBe(sourceId.toString());
    });

    it('should sort instance relations by specified field', async () => {
      const result = await instanceRelationService.queryInstanceRelations({}, { sortBy: 'description:desc' });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(3);
      expect(result.results[0].description).toBe('Third instance relation with special metadata');
      expect(result.results[result.results.length - 1].description).toBe('First instance relation');
    });

    it('should return empty results when no instance relations match filter', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const result = await instanceRelationService.queryInstanceRelations({ source: nonExistentId });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(0);
      expect(result.totalResults).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('should populate relation, source, and target details', async () => {
      const result = await instanceRelationService.queryInstanceRelations({});

      expect(result.results[0].relation).toBeDefined();
      expect(result.results[0].source).toBeDefined();
      expect(result.results[0].target).toBeDefined();
      expect(result.results[0].relation.type).toBeDefined();
      expect(result.results[0].source.name).toBeDefined();
      expect(result.results[0].target.name).toBeDefined();
    });
  });

  describe('getInstanceRelationById', () => {
    let testInstanceRelation;

    beforeEach(async () => {
      testInstanceRelation = await createTestInstanceRelation(mockRelation._id, sourceInstance._id, targetInstance._id, {
        description: 'Test instance relation',
      });
    });

    it('should return instance relation by id', async () => {
      const result = await instanceRelationService.getInstanceRelationById(testInstanceRelation._id);

      expect(result).toBeDefined();
      checkInstanceRelationMatch(result, testInstanceRelation);
      expect(result.relation).toBeDefined();
      expect(result.source).toBeDefined();
      expect(result.target).toBeDefined();
    });

    it('should throw 404 error if instance relation not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(instanceRelationService.getInstanceRelationById(nonExistentId)).rejects.toThrow(
        'Instance relation not found',
      );
    });

    it('should populate relation details, instance data and creator info', async () => {
      const result = await instanceRelationService.getInstanceRelationById(testInstanceRelation._id);
      expect(result.relation).toEqual(
        expect.objectContaining({
          id: mockRelation._id.toString(),
          type: mockRelation.type,
        }),
      );

      expect(result.source).toEqual(
        expect.objectContaining({
          id: sourceInstance._id.toString(),
          name: sourceInstance.name,
          schema: expect.any(Object),
        }),
      );

      expect(result.target).toEqual(
        expect.objectContaining({
          id: targetInstance._id.toString(),
          name: targetInstance.name,
          schema: expect.any(Object),
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
    let testInstanceRelation;

    beforeEach(async () => {
      testInstanceRelation = await createTestInstanceRelation(mockRelation._id, sourceInstance._id, targetInstance._id);
    });

    it('should return true for instance relation creator', async () => {
      const result = await instanceRelationService.isWriter(testInstanceRelation._id, userId.toString());
      expect(result).toBe(true);
    });

    it('should return true for admin user', async () => {
      const result = await instanceRelationService.isWriter(testInstanceRelation._id, adminUserId.toString());
      expect(result).toBe(true);
    });

    it('should return false for other users', async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      const result = await instanceRelationService.isWriter(testInstanceRelation._id, otherUserId.toString());
      expect(result).toBe(false);
    });

    it('should throw error for non-existent instance relation', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(instanceRelationService.isWriter(nonExistentId, userId.toString())).rejects.toThrow(
        'Instance relation not found',
      );
    });
  });

  describe('updateInstanceRelationById', () => {
    let testInstanceRelation;

    beforeEach(async () => {
      testInstanceRelation = await createTestInstanceRelation(mockRelation._id, sourceInstance._id, targetInstance._id, {
        description: 'Original description',
        metadata: { status: 'pending', priority: 'medium' },
      });
    });

    it('should update description successfully', async () => {
      const updateBody = {
        description: 'Updated description',
      };

      const result = await instanceRelationService.updateInstanceRelationById(
        testInstanceRelation._id,
        updateBody,
        userId.toString(),
      );

      expect(result.description).toBe(updateBody.description);
      expect(result.metadata).toEqual(testInstanceRelation.metadata);
    });

    it('should update metadata successfully', async () => {
      const updateBody = {
        metadata: {
          status: 'completed',
          priority: 'high',
          notes: 'This is a new field',
        },
      };

      const result = await instanceRelationService.updateInstanceRelationById(
        testInstanceRelation._id,
        updateBody,
        userId.toString(),
      );

      expect(result.metadata).toEqual(updateBody.metadata);
      expect(result.description).toBe(testInstanceRelation.description);
    });

    it('should track action_owner', async () => {
      const spy = jest.spyOn(InstanceRelation.prototype, 'save');
      const updateBody = { description: 'New description' };

      await instanceRelationService.updateInstanceRelationById(testInstanceRelation._id, updateBody, userId.toString());

      expect(spy.mock.instances[0].action_owner).toBe(userId.toString());
    });

    it('should throw error for non-existent instance relation', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateBody = { description: 'New description' };

      await expect(
        instanceRelationService.updateInstanceRelationById(nonExistentId, updateBody, userId.toString()),
      ).rejects.toThrow('Instance relation not found');
    });
  });

  describe('deleteInstanceRelationById', () => {
    let testInstanceRelation;

    beforeEach(async () => {
      testInstanceRelation = await createTestInstanceRelation(mockRelation._id, sourceInstance._id, targetInstance._id);
    });

    it('should delete instance relation successfully', async () => {
      await instanceRelationService.deleteInstanceRelationById(testInstanceRelation._id, userId.toString());

      await expect(instanceRelationService.getInstanceRelationById(testInstanceRelation._id)).rejects.toThrow(
        'Instance relation not found',
      );
    });

    it('should set action_owner before deletion', async () => {
      const spy = jest.spyOn(InstanceRelation.prototype, 'remove');

      await instanceRelationService.deleteInstanceRelationById(testInstanceRelation._id, userId.toString());

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.instances[0].action_owner).toBe(userId.toString());
    });

    it('should throw error for non-existent instance relation', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(instanceRelationService.deleteInstanceRelationById(nonExistentId, userId.toString())).rejects.toThrow(
        'Instance relation not found',
      );
    });
  });
});
