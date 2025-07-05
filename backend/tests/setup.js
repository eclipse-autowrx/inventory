// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeEach } from 'vitest';

/**
 * @type {MongoMemoryServer}
 */
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  for (const key in mongoose.connection.collections) {
    const collection = mongoose.connection.collections[key];
    await collection.deleteMany({});
  }
});
