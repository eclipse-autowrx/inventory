// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Remove vitest imports
let mongoServer;

jest.mock('../src/models/plugins/captureChange.plugin.js', () => ({
  captureCreate: jest.fn(),
  captureUpdates: jest.fn(),
  captureRemove: jest.fn(),
}));

// Use Jest lifecycle hooks
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
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
