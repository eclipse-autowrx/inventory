// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimplifiedUser, User } from './user.type';

export type CreateInventoryItem = {
  type: string;
  data: {
    [key: string | number | symbol]: any;
  };
};

export type InventoryItem = CreateInventoryItem & {
  id: string;
  typeData?: any;
};

export type InventoryType = {
  id: string;
  name: string;
  description: string;
  schema: any;
  created_by?: Partial<User>;
  createdAt: string;
  updatedAt: string;
};

export interface InventorySchema {
  id: string;
  name: string;
  description?: string;
  schema_definition: Record<string, any>;
  created_by?: User;
  created_at: string;
}

export interface InventorySchemaPopulated {
  name: string;
  id: string;
}

export interface InventorySchemaFormData {
  name: string;
  description?: string;
  schema_definition: string;
}

export type CreateInventorySchemaPayload = InventorySchemaFormData;

export type UpdateInventorySchemaPayload = Partial<
  Omit<InventorySchemaFormData, 'schema_definition'>
> & {
  schema_definition?: string;
};

export interface InventoryInstance {
  id: string;
  name: string;
  schema: InventorySchemaPopulated;
  data: Record<string, any>;
  created_by?: User;
  created_at: string;
}

export interface InventorySimplifiedInstance {
  id: string;
  name: string;
  schema: string;
}

export type InventoryInstanceDetail = Omit<InventoryInstance, 'schema'> & {
  schema: InventorySchema;
};

export type InventoryInstanceFormData = {
  name: string;
  data: Record<string, any>;
};

export type InventoryInstanceCreatePayload = Omit<
  InventoryInstanceFormData,
  'data'
> & {
  data: string;
  schema: string;
};

export type InventoryInstanceUpdatePayload = Partial<
  Omit<InventoryInstanceFormData, 'data'> & {
    data?: string;
  }
>;

export type InventorySimplifiedSchema = {
  id: string;
  name: string;
};

type RelationType = 'association' | 'inheritance' | 'composition';

export type RelationCardinality =
  | 'one-to-one'
  | 'zero-to-one'
  | 'one-to-many'
  | 'zero-to-many';

export interface InventoryRelation {
  id: string;
  name: string;
  type: RelationType;
  description?: string;
  source: InventorySimplifiedSchema;
  source_cardinality?: RelationCardinality;
  source_role_name?: string;
  target: InventorySimplifiedSchema;
  target_cardinality?: RelationCardinality;
  target_role_name?: string;
  is_core?: boolean;
  metadata?: Record<string, any>;
  created_by?: SimplifiedUser;
}

export interface InventorySimplifiedRelation {
  id: string;
  name: string;
  type: string;
  source: string;
  target: string;
}

export interface InventoryRelationFormData {
  name: string;
  type: string;
  source: string;
  target: string;
  source_role_name?: string;
  target_role_name?: string;
  source_cardinality?: string | null;
  target_cardinality?: string | null;
}

export interface InventoryInstanceRelation {
  id: string;
  relation: InventorySimplifiedRelation;
  source: InventorySimplifiedInstance;
  target: InventorySimplifiedInstance;
  metadata: any;
  created_by?: SimplifiedUser;
  description?: string;
}

export interface InventoryInstanceRelationFormData {
  relation: string;
  source: string;
  target: string;
  description?: string;
  metadata?: string;
}

export type InventoryInstanceRelationUpdatePayload = {
  description?: string;
  metadata?: string;
};
