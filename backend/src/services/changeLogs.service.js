// Copyright (c) 2025 Eclipse Foundation.
//
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

const { escapeRegExp } = require('lodash');
const ChangeLog = require('../models/changeLog.model');
const { buildMongoSearchFilter } = require('../utils/queryUtils');
const { parseISO, isValid } = require('date-fns');

/**
 * Parse date filter from query parameter
 * Supports formats:
 * - Single date: "2025-01-01"
 * - Date range: "2025-01-01,2025-01-31"
 * - Greater than: ">2025-01-01"
 * - Less than: "<2025-01-01"
 * @param {string} dateParam - Date parameter from query
 * @returns {Object|null} MongoDB date filter object or null
 */
const parseDateFilter = (dateParam) => {
  if (!dateParam) return null;

  const dateStr = dateParam.toString().trim();

  // Handle operators
  if (dateStr.startsWith('>')) {
    const date = parseISO(dateStr.substring(1));
    return isValid(date) ? { $gte: date } : null;
  }

  if (dateStr.startsWith('<')) {
    const date = parseISO(dateStr.substring(1));
    return isValid(date) ? { $lte: date } : null;
  }

  // Handle date range
  if (dateStr.includes(',')) {
    const [startStr, endStr] = dateStr.split(',').map((d) => d.trim());
    const startDate = parseISO(startStr);
    const endDate = parseISO(endStr);

    if (isValid(startDate) && isValid(endDate)) {
      return {
        $gte: startDate,
        $lte: endDate,
      };
    }
    return null;
  }

  // Handle single date - if it's just a date (no time), treat as UTC day range
  const date = parseISO(dateStr);
  if (isValid(date)) {
    // If input is just a date (YYYY-MM-DD), create UTC day range
    if (dateStr.length === 10) {
      return {
        $gte: new Date(dateStr + 'T00:00:00.000Z'),
        $lte: new Date(dateStr + 'T23:59:59.999Z'),
      };
    }
    // If input includes time, use as-is
    return {
      $gte: date,
      $lte: date,
    };
  }

  return null;
};

/**
 * Build date range filter for createdAt and updatedAt
 * @param {Object} advanced - Advanced options containing date filters
 * @returns {Object} Date range filter object
 */
const buildDateRangeFilter = (advanced) => {
  const dateFilter = {};

  if (advanced.createdAt) {
    const createdAtFilter = parseDateFilter(advanced.createdAt);
    if (createdAtFilter) dateFilter.createdAt = createdAtFilter;
  }

  if (advanced.updatedAt) {
    const updatedAtFilter = parseDateFilter(advanced.updatedAt);
    if (updatedAtFilter) dateFilter.updatedAt = updatedAtFilter;
  }

  return dateFilter;
};

/**
 * Query for change logs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {Object} [advanced] - Advanced options: search, createdAt, updatedAt
 * @returns {Promise<QueryResult>}
 */
const queryChangeLogs = async (filter = {}, options = {}, advanced = {}) => {
  if (filter.ref_type) {
    const sanitizedRefType = escapeRegExp(filter.ref_type);
    filter.ref_type = new RegExp(`^${sanitizedRefType}$`, 'i');
  }

  // Build search filter
  const searchFilter = buildMongoSearchFilter(filter, advanced.search, ['description', 'ref_type', 'action']);

  // Build date range filter
  const dateRangeFilter = buildDateRangeFilter(advanced);

  // Combine all filters
  const finalFilter = {
    ...searchFilter,
    ...dateRangeFilter,
  };

  const changeLogs = await ChangeLog.paginate(finalFilter, options);
  return changeLogs;
};

module.exports.queryChangeLogs = queryChangeLogs;
