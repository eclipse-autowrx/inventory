// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const { GraphQLScalarType } = require('graphql');
const { schemaService, instanceService } = require('../services');
const { transpileSchema } = require('graphql-s2s').graphqls2s;
const { makeExecutableSchema } = require('graphql-tools');

const ObjectScalarType = new GraphQLScalarType({
  name: 'Object',
  description: 'Arbitrary object',
});

const typeDefs = `#graphql
  scalar Object

  type User {
    id: ID!
    name: String
    image_file: String
  }

  type Schema {
    id: ID!
    name: String!
    description: String
    schema_definition: Object!
    created_by: User
  }

  type SimpledSchema {
    id: ID!
    name: String!
  }

  type Instance {
    id: ID!
    name: String!
    schema: SimpledSchema!
    data: Object!
    created_by: User
  }

  type Result<T> {
    results: [T]
    page: Int
    limit: Int
    totalPage: Int
    totalResults: Int
  }

  input Filter {
    name: String
    created_by: String
  }

  input Options {
    page: Int = 1
    limit: Int = 10
    sortBy: String
  }

  input Advanced {
    search: String
  }

  type Query {
    schemas(filter: Filter, options: Options, advanced: Advanced): Result<Schema>!
    schema(id: ID!): Schema
    instances(filter: Filter, options: Options, advanced: Advanced): Result<Instance>!
    instance(id: ID!): Instance
  }
`;

const resolvers = {
  Object: ObjectScalarType,
  Query: {
    schemas: (_, { filter, options, advanced }) => {
      return schemaService.querySchemas(filter, options, advanced);
    },
    schema: (_, { id }) => schemaService.getSchemaById(id),
    instances: (_, { filter, options, advanced }) => {
      return instanceService.queryInstances(filter, options, advanced);
    },
    instance: (_, { id }) => instanceService.getInstanceById(id),
  },
};

const schema = makeExecutableSchema({
  typeDefs: [transpileSchema(typeDefs)],
  resolvers,
});

module.exports = {
  schema,
};
