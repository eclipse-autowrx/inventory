// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import { describe, expect, it, vi } from 'vitest';
import { schemaService } from '../../../src/services';
import mongoose from 'mongoose';

describe('Schema Service', () => {
  let userId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create schema', () => {
    const mockSchemaBody = {
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
    };

    it('should create a schema successfully', async () => {
      const result = await schemaService.createSchema(mockSchemaBody, userId.toString());
      expect(result).toBeDefined();
      expect(result.name).toBe(mockSchemaBody.name);
      expect(result.description).toBe(mockSchemaBody.description);
      expect(result.schema_definition).toBe(mockSchemaBody.schema_definition);
      expect(result.created_by).toEqual(userId);
    });
  });
});
