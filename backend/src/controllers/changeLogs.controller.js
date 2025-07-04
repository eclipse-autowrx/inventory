// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { changeLogsService } = require('../services');

const getChangeLogs = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['created_by', 'ref_type', 'ref', 'action']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const advanced = pick(req.query, ['search', 'createdAt', 'updatedAt']);
  const result = await changeLogsService.queryChangeLogs(filter, options, advanced);
  res.send(result);
});

module.exports.getChangeLogs = getChangeLogs;
