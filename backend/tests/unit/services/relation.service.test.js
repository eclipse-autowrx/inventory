// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const mongoose = require('mongoose');
const { relationService } = require('../../../src/services');
const { Relation } = require('../../../src/models');
const ApiError = require('../../../src/utils/ApiError');
const {
  testIds,
  setupCommonMocks,
  createTestSchema,
  createTestRelation,
  generateMockRelationBody,
  checkRelationMatch,
  checkRelationsMatch,
} = require('../helpers/service-test.helper');

describe('Relation Service', () => {
  let userId;
  let adminUserId;
  let sourceSchema;
  let targetSchema;

  beforeEach(async () => {
    userId = testIds.userId;
    adminUserId = testIds.adminUserId;
    setupCommonMocks();

    // Create test schemas for relations
    sourceSchema = await createTestSchema({ name: 'Source Schema' });
    targetSchema = await createTestSchema({ name: 'Target Schema' });
  });

  describe('createRelation', () => {
    it('should create relation successfully', async () => {
      const mockRelationBody = generateMockRelationBody(sourceSchema._id, targetSchema._id);
      const result = await relationService.createRelation(mockRelationBody, userId.toString());

      expect(result).toBeDefined();
      expect(result.name).toBe(mockRelationBody.name);
      expect(result.type).toBe(mockRelationBody.type);
      expect(result.source.toString()).toBe(mockRelationBody.source.toString());
      expect(result.target.toString()).toBe(mockRelationBody.target.toString());
      expect(result.created_by.toString()).toBe(userId.toString());
    });

    it('should throw error if source schema does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const mockRelationBody = generateMockRelationBody(nonExistentId, targetSchema._id);

      await expect(relationService.createRelation(mockRelationBody, userId.toString())).rejects.toThrow(
        `Source schema with id ${nonExistentId} not found`,
      );
    });

    it('should throw error if target schema does not exist', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const mockRelationBody = generateMockRelationBody(sourceSchema._id, nonExistentId);

      await expect(relationService.createRelation(mockRelationBody, userId.toString())).rejects.toThrow(
        `Target schema with id ${nonExistentId} not found`,
      );
    });

    it('should allow self-referencing relations', async () => {
      const mockRelationBody = generateMockRelationBody(sourceSchema._id, sourceSchema._id);
      const result = await relationService.createRelation(mockRelationBody, userId.toString());

      expect(result).toBeDefined();
      expect(result.source.toString()).toBe(result.target.toString());
    });

    it('should throw error if relation of same type between schemas already exists', async () => {
      const mockRelationBody = generateMockRelationBody(sourceSchema._id, targetSchema._id);

      // Create first relation
      await relationService.createRelation(mockRelationBody, userId.toString());

      // Try to create same relation again
      await expect(relationService.createRelation(mockRelationBody, userId.toString())).rejects.toThrow(
        'Relation of this type between these schemas already exists',
      );
    });

    it('should truncate cardinality fields on receiving emtpy value', async () => {
      const spy = jest.spyOn(Relation, 'create');
      const mockRelationBody = {
        ...generateMockRelationBody(sourceSchema._id, targetSchema._id),
        name: 'Relation with Null Cardinality',
        source_cardinality: null,
        target_cardinality: null,
      };

      const result = await relationService.createRelation(mockRelationBody, userId.toString());
      expect(result).toBeDefined();
      expect(result.source_cardinality).toBeUndefined();
      expect(result.target_cardinality).toBeUndefined();
      expect(spy.mock.calls[0][0].source_cardinality).toBeUndefined();
      expect(spy.mock.calls[0][0].target_cardinality).toBeUndefined();
    });
  });

  describe('queryRelations', () => {
    let createdRelations;

    beforeEach(async () => {
      createdRelations = [];
      createdRelations.push(
        await createTestRelation(sourceSchema._id, targetSchema._id, {
          name: 'Relation 1',
          type: 'association',
        }),
      );
      createdRelations.push(
        await createTestRelation(sourceSchema._id, targetSchema._id, {
          name: 'Relation 2',
          type: 'composition',
          source_cardinality: 'one-to-many',
        }),
      );
      createdRelations.push(
        await createTestRelation(targetSchema._id, sourceSchema._id, {
          name: 'Reverse Relation compo',
          type: 'inheritance',
          description: 'This is a special relation',
        }),
      );
    });

    it('should return paginated relations', async () => {
      const result = await relationService.queryRelations({}, { limit: 2, page: 1 });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.totalResults).toBe(3);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
      checkRelationsMatch(result, createdRelations.slice(0, 2));
    });

    it('should filter relations by source schema', async () => {
      const result = await relationService.queryRelations({ source: sourceSchema._id });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(2);
      expect(result.totalResults).toBe(2);
      checkRelationMatch(result.results[0], createdRelations[0]);
      checkRelationMatch(result.results[1], createdRelations[1]);
    });

    it('should filter relations by target schema', async () => {
      const result = await relationService.queryRelations({ target: sourceSchema._id });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(1);
      expect(result.totalResults).toBe(1);
      checkRelationMatch(result.results[0], createdRelations[2]);
    });

    it('should filter relations by type', async () => {
      const result = await relationService.queryRelations({ type: 'composition' });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(1);
      checkRelationMatch(result.results[0], createdRelations[1]);
    });

    it('should search relations by text in name, description, source_role_name, target_role_name', async () => {
      const anotherSchema = await createTestSchema({ name: 'Another Schema' });
      const descriptionRelation = await createTestRelation(anotherSchema._id, targetSchema._id, {
        name: 'Description Relation',
        description: 'This relation has a description with compo',
        type: 'association',
      });
      const sourceRoleNameRelation = await createTestRelation(anotherSchema._id, targetSchema._id, {
        name: 'Source Role Relation',
        type: 'inheritance',
        source_role_name: 'with compo',
      });
      const targetRoleNameRelation = await createTestRelation(anotherSchema._id, sourceSchema._id, {
        name: 'Target Role Relation',
        type: 'association',
        target_role_name: 'with compo',
      });

      const result = await relationService.queryRelations({}, {}, { search: 'compo' });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(4);
      checkRelationMatch(result.results[0], createdRelations[2]);
      checkRelationMatch(result.results[1], descriptionRelation);
      checkRelationMatch(result.results[2], sourceRoleNameRelation);
      checkRelationMatch(result.results[3], targetRoleNameRelation);
    });

    it('should return empty results when no relations match filter', async () => {
      const result = await relationService.queryRelations({ name: 'Non-existent Relation' });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(0);
      expect(result.totalResults).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it('should sort relations by specified field', async () => {
      const result = await relationService.queryRelations({}, { sortBy: 'name:desc' });

      expect(result).toBeDefined();
      expect(result.results.length).toBe(3);
      expect(result.results[0].name).toBe('Reverse Relation compo');
      expect(result.results[result.results.length - 1].name).toBe('Relation 1');
    });
  });

  describe('getRelationById', () => {
    let testRelation;

    beforeEach(async () => {
      testRelation = await createTestRelation(sourceSchema._id, targetSchema._id);
    });

    it('should return relation by id', async () => {
      const result = await relationService.getRelationById(testRelation._id);

      expect(result).toBeDefined();
      checkRelationMatch(result, testRelation);
      expect(result.source).toBeDefined();
      expect(result.target).toBeDefined();
    });

    it('should throw 404 error if relation not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(relationService.getRelationById(nonExistentId)).rejects.toThrow('Relation not found');
    });

    it('should populate schema details and creator information', async () => {
      const result = await relationService.getRelationById(testRelation._id);

      expect(result.source).toEqual(
        expect.objectContaining({
          id: sourceSchema._id.toString(),
          name: 'Source Schema',
        }),
      );

      expect(result.target).toEqual(
        expect.objectContaining({
          id: targetSchema._id.toString(),
          name: 'Target Schema',
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
    let testRelation;

    beforeEach(async () => {
      testRelation = await createTestRelation(sourceSchema._id, targetSchema._id);
    });

    it('should return true for relation creator', async () => {
      const result = await relationService.isWriter(testRelation._id, userId.toString());
      expect(result).toBe(true);
    });

    it('should return true for admin user', async () => {
      const result = await relationService.isWriter(testRelation._id, adminUserId.toString());
      expect(result).toBe(true);
    });

    it('should return false for other users', async () => {
      const otherUserId = new mongoose.Types.ObjectId();
      const result = await relationService.isWriter(testRelation._id, otherUserId.toString());
      expect(result).toBe(false);
    });

    it('should throw error for non-existent relation', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      await expect(relationService.isWriter(nonExistentId, userId.toString())).rejects.toThrow('Relation not found');
    });
  });

  describe('updateRelationById', () => {
    let testRelation;

    beforeEach(async () => {
      testRelation = await createTestRelation(sourceSchema._id, targetSchema._id, {
        name: 'Original Relation Name',
        description: 'Original description',
        type: 'association',
        source_cardinality: 'one-to-one',
        target_cardinality: 'one-to-many',
      });
    });

    it('should update relation name and description', async () => {
      const updateBody = {
        name: 'Updated Relation Name',
        description: 'Updated description',
      };

      const result = await relationService.updateRelationById(testRelation._id, updateBody, userId.toString());

      expect(result.name).toBe(updateBody.name);
      expect(result.description).toBe(updateBody.description);
      expect(result.type).toBe(testRelation.type);
    });

    it('should update cardinality properties', async () => {
      const updateBody = {
        source_cardinality: 'zero-to-one',
        target_cardinality: 'zero-to-many',
      };

      const result = await relationService.updateRelationById(testRelation._id, updateBody, userId.toString());

      expect(result.source_cardinality).toBe(updateBody.source_cardinality);
      expect(result.target_cardinality).toBe(updateBody.target_cardinality);
    });

    it('should set cardinality to null/undefined when explicitly set to null', async () => {
      const updateBody = {
        source_cardinality: null,
        target_cardinality: null,
      };

      const result = await relationService.updateRelationById(testRelation._id, updateBody, userId.toString());

      expect(result.source_cardinality).toBeUndefined();
      expect(result.target_cardinality).toBeUndefined();
    });

    it('should update role names', async () => {
      const updateBody = {
        source_role_name: 'contains',
        target_role_name: 'containedIn',
      };

      const result = await relationService.updateRelationById(testRelation._id, updateBody, userId.toString());

      expect(result.source_role_name).toBe(updateBody.source_role_name);
      expect(result.target_role_name).toBe(updateBody.target_role_name);
    });

    it('should throw error when trying to update source, target, or type', async () => {
      const updateBody = {
        source: new mongoose.Types.ObjectId(),
      };

      await expect(relationService.updateRelationById(testRelation._id, updateBody, userId.toString())).rejects.toThrow(
        'Updating source, target, or type is not recommended. Delete and recreate if needed.',
      );
    });

    it('should track action_owner', async () => {
      const spy = jest.spyOn(Relation.prototype, 'save');
      const updateBody = { name: 'New Name' };

      await relationService.updateRelationById(testRelation._id, updateBody, userId.toString());

      expect(spy.mock.instances[0].action_owner).toBe(userId.toString());
    });

    it('should throw error for non-existent relation', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updateBody = { name: 'New Name' };

      await expect(relationService.updateRelationById(nonExistentId, updateBody, userId.toString())).rejects.toThrow(
        'Relation not found',
      );
    });
  });

  describe('deleteRelationById', () => {
    let testRelation;

    beforeEach(async () => {
      testRelation = await createTestRelation(sourceSchema._id, targetSchema._id);
    });

    it('should delete relation successfully', async () => {
      await relationService.deleteRelationById(testRelation._id, userId.toString());

      await expect(relationService.getRelationById(testRelation._id)).rejects.toThrow('Relation not found');
    });

    it('should set action_owner before deletion', async () => {
      const spy = jest.spyOn(Relation.prototype, 'remove');

      await relationService.deleteRelationById(testRelation._id, userId.toString());

      expect(spy).toHaveBeenCalled();
      expect(spy.mock.instances[0].action_owner).toBe(userId.toString());
    });

    it('should throw error for non-existent relation', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      await expect(relationService.deleteRelationById(nonExistentId, userId.toString())).rejects.toThrow(
        'Relation not found',
      );
    });
  });
});
