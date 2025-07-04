// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { relationService } = require('../services');

const createRelation = catchAsync(async (req, res) => {
  const relation = await relationService.createRelation(req.body, req.user.id);
  res.status(httpStatus.CREATED).send(relation);
});

const getRelations = catchAsync(async (req, res) => {
  const filter = pick(req.query, [
    'type',
    'source',
    'target',
    'name',
    'source_role_name',
    'target_role_name',
    'is_core',
    'source_cardinality',
    'target_cardinality',
  ]);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const advanced = pick(req.query, ['search']);
  const result = await relationService.queryRelations(filter, options, advanced);
  res.send(result);
});

const getRelation = catchAsync(async (req, res) => {
  const relation = await relationService.getRelationById(req.params.relationId);
  res.send(relation);
});

const updateRelation = catchAsync(async (req, res) => {
  if (!(await relationService.isWriter(req.params.relationId, req.user.id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to update this relation');
  }
  const relation = await relationService.updateRelationById(req.params.relationId, req.body, req.user.id);
  res.send(relation);
});

const deleteRelation = catchAsync(async (req, res) => {
  if (!(await relationService.isWriter(req.params.relationId, req.user.id))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this relation');
  }
  await relationService.deleteRelationById(req.params.relationId, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRelation,
  getRelations,
  getRelation,
  updateRelation,
  deleteRelation,
};
