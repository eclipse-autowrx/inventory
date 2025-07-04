// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const Joi = require('joi');
const { objectId, dateFilter } = require('./custom.validation');

const getChangeLogs = {
  query: Joi.object().keys({
    // Filter fields from the ChangeLog model
    created_by: Joi.string().custom(objectId),
    ref_type: Joi.string().trim(),
    ref: Joi.string().custom(objectId),
    action: Joi.string().valid('CREATE', 'UPDATE', 'DELETE'),

    // Pagination and sorting
    sortBy: Joi.string(),
    limit: Joi.number().integer().min(1).max(100),
    page: Joi.number().integer().min(1),

    // Advanced search and date filters
    search: Joi.string().trim(),
    createdAt: Joi.string().custom(dateFilter),
    updatedAt: Joi.string().custom(dateFilter),
  }),
};

module.exports.getChangeLogs = getChangeLogs;
